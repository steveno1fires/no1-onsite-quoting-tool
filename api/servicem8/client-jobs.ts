import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { company_uuid } = request.query;

  if (!company_uuid || typeof company_uuid !== "string") {
    return response.status(400).json({ error: "company_uuid is required" });
  }

  try {
    const sm8Response = await fetch(
      `https://api.servicem8.com/api_1.0/job.json?%24filter=company_uuid%20eq%20'${encodeURIComponent(company_uuid)}'`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer smk-a5f784-21bf3b7b4b868ff6-54fbf7018be798d3`,
        },
      }
    );

    if (!sm8Response.ok) {
      return response.status(sm8Response.status).json({
        error: `ServiceM8 API error: ${sm8Response.statusText}`,
      });
    }

    const jobs = await sm8Response.json();

    // Map to simplified format, sorted by date descending
    const mapped = jobs
      .map((j: any) => ({
        uuid: j.uuid,
        jobNumber: j.generated_job_id || j.uuid.slice(0, 8),
        description: j.job_description || "",
        status: j.status || "",
        date: j.date || "",
        address: [j.job_address, j.job_city, j.job_postcode]
          .filter(Boolean)
          .join(", "),
      }))
      .sort((a: any, b: any) => (b.date || "").localeCompare(a.date || ""))
      .slice(0, 25);

    return response.status(200).json({ results: mapped });
  } catch (error) {
    console.error("SM8 Jobs Error:", error);
    return response.status(500).json({
      error: "Failed to fetch client jobs",
    });
  }
}
