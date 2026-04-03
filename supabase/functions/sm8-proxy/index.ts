import { corsHeaders } from "@supabase/supabase-js/cors";

const SM8_BASE = "https://api.servicem8.com/api_1.0";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const SM8_TOKEN = Deno.env.get("SM8_API_KEY");
  if (!SM8_TOKEN) {
    return new Response(JSON.stringify({ error: "SM8_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  try {
    if (action === "search-clients") {
      return await handleSearchClients(url, SM8_TOKEN);
    }
    if (action === "client-jobs") {
      return await handleClientJobs(url, SM8_TOKEN);
    }
    if (action === "job") {
      return await handleJob(url, SM8_TOKEN);
    }
    if (action === "upload-quote") {
      return await handleUploadQuote(req, SM8_TOKEN);
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("SM8 proxy error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleSearchClients(url: URL, token: string) {
  const q = url.searchParams.get("q");
  const isAll = q === "*";
  if (!isAll && (!q || q.trim().length < 2)) {
    return json({ error: "Search query must be at least 2 characters" }, 400);
  }

  const [compRes, jobRes] = await Promise.all([
    fetch(`${SM8_BASE}/company.json`, { headers: { "X-Api-Key": token } }),
    fetch(`${SM8_BASE}/job.json`, { headers: { "X-Api-Key": token } }),
  ]);

  if (!compRes.ok) {
    return json({ error: `SM8 error: ${compRes.statusText}` }, compRes.status);
  }

  const companies = await compRes.json() as any[];
  const jobs = jobRes.ok ? (await jobRes.json() as any[]) : [];

  const companyJobs = new Map<string, { jobNumber: string; date: string }[]>();
  for (const j of jobs) {
    const cid = j.company_uuid;
    if (!cid) continue;
    if (!companyJobs.has(cid)) companyJobs.set(cid, []);
    companyJobs.get(cid)!.push({ jobNumber: j.generated_job_id || "", date: j.date || "" });
  }
  for (const [, arr] of companyJobs) {
    arr.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }

  const term = isAll ? "" : (q as string).trim().toLowerCase();
  const filtered = (isAll
    ? companies
    : companies.filter((c) => {
        const name = (c.name || "").toLowerCase();
        const email = (c.email || "").toLowerCase();
        const phone = (c.phone || c.mobile || "").toLowerCase();
        return name.includes(term) || email.includes(term) || phone.includes(term);
      })
  )
    .map((c) => {
      const cJobs = companyJobs.get(c.uuid) || [];
      return {
        uuid: c.uuid,
        name: c.name || "",
        email: c.email || "",
        phone: c.phone || c.mobile || "",
        address: [c.address, c.address_city, c.address_postcode].filter(Boolean).join(", "),
        latestJobNumber: cJobs.length > 0 ? cJobs[0].jobNumber : "",
        jobCount: cJobs.length,
      };
    })
    .sort((a, b) => {
      if (a.jobCount && !b.jobCount) return -1;
      if (!a.jobCount && b.jobCount) return 1;
      return (b.latestJobNumber || "").localeCompare(a.latestJobNumber || "");
    });

  return json({ results: filtered });
}

async function handleClientJobs(url: URL, token: string) {
  const companyUuid = url.searchParams.get("company_uuid");
  if (!companyUuid) return json({ error: "company_uuid required" }, 400);

  const sm8Res = await fetch(
    `${SM8_BASE}/job.json?%24filter=company_uuid%20eq%20'${encodeURIComponent(companyUuid)}'`,
    { headers: { "X-Api-Key": token } },
  );
  if (!sm8Res.ok) return json({ error: `SM8 error: ${sm8Res.statusText}` }, sm8Res.status);

  const jobs = await sm8Res.json() as any[];
  const mapped = jobs
    .map((j) => ({
      uuid: j.uuid,
      jobNumber: j.generated_job_id || j.uuid.slice(0, 8),
      description: j.job_description || "",
      status: j.status || "",
      date: j.date || "",
      address: [j.job_address, j.job_city, j.job_postcode].filter(Boolean).join(", "),
    }))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 25);

  return json({ results: mapped });
}

async function handleJob(url: URL, token: string) {
  const id = url.searchParams.get("id");
  if (!id) return json({ error: "Job ID required" }, 400);

  const sm8Res = await fetch(`${SM8_BASE}/job/${id}.json`, {
    headers: { "X-Api-Key": token },
  });
  if (!sm8Res.ok) {
    return json(
      { error: sm8Res.status === 404 ? "Job not found" : `SM8 error` },
      sm8Res.status,
    );
  }
  return json(await sm8Res.json());
}

async function handleUploadQuote(req: Request, token: string) {
  const { jobUuid, filename, fileBase64, caption } = await req.json();
  if (!jobUuid || !filename || !fileBase64) {
    return json({ error: "Missing jobUuid, filename, or fileBase64" }, 400);
  }

  // Create attachment record
  const createRes = await fetch(`${SM8_BASE}/attachment.json`, {
    method: "POST",
    headers: { "X-Api-Key": token, "Content-Type": "application/json" },
    body: JSON.stringify({
      related_object: "job",
      related_object_uuid: jobUuid,
      attachment_name: filename,
      file_type: ".pdf",
      active: 1,
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    return json({ error: "Failed to create attachment", details: err }, createRes.status);
  }

  const attachmentUuid = createRes.headers.get("x-record-uuid") || "";
  if (!attachmentUuid) {
    const createData = await createRes.json().catch(() => ({}));
    const uuid = (createData as any).uuid || "";
    if (!uuid) return json({ error: "No attachment UUID returned" }, 500);
  }

  const finalUuid = attachmentUuid || "";

  // Decode base64 and upload file
  const binaryStr = atob(fileBase64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  const uploadRes = await fetch(`${SM8_BASE}/attachment/${finalUuid}.file`, {
    method: "POST",
    headers: {
      "X-Api-Key": token,
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
    body: bytes,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    return json({ error: "Failed to upload file", details: err }, uploadRes.status);
  }

  return json({ success: true, attachmentUuid: finalUuid });
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}