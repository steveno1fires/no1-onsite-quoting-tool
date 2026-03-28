import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { q } = request.query;

  const isAll = q === "*";

  if (!isAll && (!q || typeof q !== "string" || q.trim().length < 2)) {
    return response.status(400).json({ error: "Search query must be at least 2 characters" });
  }

  const searchTerm = q.trim().toLowerCase();

  try {
    // Fetch companies from ServiceM8
    const sm8Response = await fetch(
      `https://api.servicem8.com/api_1.0/company.json`,
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

    const companies = await sm8Response.json();

    // Filter client-side since SM8 API filtering is limited
    const filtered = companies
      .filter((c: any) => {
        const name = (c.name || "").toLowerCase();
        const email = (c.email || "").toLowerCase();
        const phone = (c.phone || c.mobile || "").toLowerCase();
        return (
          name.includes(searchTerm) ||
          email.includes(searchTerm) ||
          phone.includes(searchTerm)
        );
      })
      .slice(0, 15) // Limit results
      .map((c: any) => ({
        uuid: c.uuid,
        name: c.name || "",
        email: c.email || "",
        phone: c.phone || c.mobile || "",
        address: [c.address, c.address_city, c.address_postcode]
          .filter(Boolean)
          .join(", "),
      }));

    return response.status(200).json({ results: filtered });
  } catch (error) {
    console.error("SM8 Search Error:", error);
    return response.status(500).json({
      error: "Failed to search clients",
    });
  }
}
