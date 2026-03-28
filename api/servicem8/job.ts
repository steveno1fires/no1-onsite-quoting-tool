import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { id } = request.query;

  if (!id || typeof id !== "string") {
    return response.status(400).json({ error: "Job ID required" });
  }

  try {
    const sm8Response = await fetch(
      `https://api.servicem8.com/api_1.0/job/${id}.json`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer smk-a5f784-21bf3b7b4b868ff6-54fbf7018be798d3`,
        },
      }
    );

    if (!sm8Response.ok) {
      if (sm8Response.status === 404) {
        return response.status(404).json({ error: "Job not found" });
      }
      return response.status(sm8Response.status).json({
        error: `ServiceM8 API error: ${sm8Response.statusText}`,
      });
    }

    const data = await sm8Response.json();
    return response.status(200).json(data);
  } catch (error) {
    console.error("API Proxy Error:", error);
    return response.status(500).json({
      error: "Failed to fetch job details from ServiceM8",
    });
  }
}
