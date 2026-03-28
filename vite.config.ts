import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

function sm8ApiPlugin(): Plugin {
  const SM8_TOKEN = "smk-a5f784-6ea17ab17249c972-707b5ecb521890de";
  const SM8_BASE = "https://api.servicem8.com/api_1.0";

  return {
    name: "sm8-api-proxy",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || "", `http://${req.headers.host}`);

        if (url.pathname === "/api/servicem8/search-clients") {
          const q = url.searchParams.get("q");
          const isAll = q === "*";
          if (!isAll && (!q || q.trim().length < 2)) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Search query must be at least 2 characters" }));
            return;
          }
          try {
            // Fetch companies and jobs in parallel
            const [compRes, jobRes] = await Promise.all([
              fetch(`${SM8_BASE}/company.json`, { headers: { "X-Api-Key": SM8_TOKEN } }),
              fetch(`${SM8_BASE}/job.json`, { headers: { "X-Api-Key": SM8_TOKEN } }),
            ]);
            if (!compRes.ok) {
              res.statusCode = compRes.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: `SM8 error: ${compRes.statusText}` }));
              return;
            }
            const companies = await compRes.json() as any[];
            const jobs = jobRes.ok ? await jobRes.json() as any[] : [];

            // Build map: company_uuid -> latest job numbers
            const companyJobs = new Map<string, { jobNumber: string; date: string }[]>();
            for (const j of jobs) {
              const cid = j.company_uuid;
              if (!cid) continue;
              if (!companyJobs.has(cid)) companyJobs.set(cid, []);
              companyJobs.get(cid)!.push({
                jobNumber: j.generated_job_id || "",
                date: j.date || "",
              });
            }
            // Sort each company's jobs by date desc
            for (const [, arr] of companyJobs) {
              arr.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
            }

            const term = isAll ? "" : (q as string).trim().toLowerCase();
            const filtered = (isAll ? companies : companies
              .filter((c) => {
                const name = (c.name || "").toLowerCase();
                const email = (c.email || "").toLowerCase();
                const phone = (c.phone || c.mobile || "").toLowerCase();
                return name.includes(term) || email.includes(term) || phone.includes(term);
              }))
              .map((c) => {
                const cJobs = companyJobs.get(c.uuid) || [];
                const latestJobNumber = cJobs.length > 0 ? cJobs[0].jobNumber : "";
                return {
                  uuid: c.uuid,
                  name: c.name || "",
                  email: c.email || "",
                  phone: c.phone || c.mobile || "",
                  address: [c.address, c.address_city, c.address_postcode].filter(Boolean).join(", "),
                  latestJobNumber,
                  jobCount: cJobs.length,
                };
              })
              .sort((a, b) => {
                // Sort clients with jobs first, then by latest job number desc
                if (a.jobCount && !b.jobCount) return -1;
                if (!a.jobCount && b.jobCount) return 1;
                return (b.latestJobNumber || "").localeCompare(a.latestJobNumber || "");
              })
              ;
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ results: filtered }));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Failed to search clients" }));
          }
          return;
        }

        if (url.pathname === "/api/servicem8/client-jobs") {
          const companyUuid = url.searchParams.get("company_uuid");
          if (!companyUuid) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "company_uuid required" }));
            return;
          }
          try {
            const sm8Res = await fetch(
              `${SM8_BASE}/job.json?%24filter=company_uuid%20eq%20'${encodeURIComponent(companyUuid)}'`,
              { headers: { "X-Api-Key": SM8_TOKEN } }
            );
            if (!sm8Res.ok) {
              res.statusCode = sm8Res.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: `SM8 error: ${sm8Res.statusText}` }));
              return;
            }
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
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ results: mapped }));
          } catch {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Failed to fetch jobs" }));
          }
          return;
        }

        if (url.pathname === "/api/servicem8/job") {
          const id = url.searchParams.get("id");
          if (!id) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Job ID required" }));
            return;
          }
          try {
            const sm8Res = await fetch(`${SM8_BASE}/job/${id}.json`, {
              headers: { "X-Api-Key": SM8_TOKEN },
            });
            if (!sm8Res.ok) {
              res.statusCode = sm8Res.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: sm8Res.status === 404 ? "Job not found" : `SM8 error` }));
              return;
            }
            const data = await sm8Res.json();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
          } catch {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Failed to fetch job" }));
          }
          return;
        }

        // Upload attachment to SM8 job
        if (url.pathname === "/api/servicem8/upload-quote" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
          req.on("end", async () => {
            try {
              const { jobUuid, filename, fileBase64 } = JSON.parse(body);
              if (!jobUuid || !filename || !fileBase64) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing jobUuid, filename, or fileBase64" }));
                return;
              }

              // Step 1: Create attachment record
              const createRes = await fetch(`${SM8_BASE}/attachment.json`, {
                method: "POST",
                headers: {
                  "X-Api-Key": SM8_TOKEN,
                  "Content-Type": "application/json",
                },
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
                res.statusCode = createRes.status;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Failed to create attachment", details: err }));
                return;
              }

              // Get the attachment UUID from the response
              const attachmentUuid = createRes.headers.get("x-record-uuid") || "";
              if (!attachmentUuid) {
                // Try to get from response body
                const createData = await createRes.json().catch(() => ({}));
                const uuid = (createData as any).uuid || "";
                if (!uuid) {
                  res.statusCode = 500;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ error: "No attachment UUID returned" }));
                  return;
                }
              }

              const finalUuid = attachmentUuid || "";

              // Step 2: Upload the file content
              const fileBuffer = Buffer.from(fileBase64, "base64");
              const uploadRes = await fetch(
                `${SM8_BASE}/attachment/${finalUuid}.file`,
                {
                  method: "POST",
                  headers: {
                    "X-Api-Key": SM8_TOKEN,
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename="${filename}"`,
                  },
                  body: fileBuffer,
                }
              );

              if (!uploadRes.ok) {
                const err = await uploadRes.text();
                res.statusCode = uploadRes.status;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Failed to upload file", details: err }));
                return;
              }

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: true, attachmentUuid: finalUuid }));
            } catch (e) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Upload failed", details: String(e) }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), sm8ApiPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
