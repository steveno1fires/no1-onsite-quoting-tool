// src/api/servicem8/upload-quote.ts
// Upload generated quote PDF to ServiceM8 job record

const SM8_API_KEY = process.env.SM8_API_KEY || 'smk-a5f784-6ea17ab17249c972-707b5ecb521890de';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobId, filename, fileContent } = req.body;

  if (!jobId || !filename || !fileContent) {
    return res.status(400).json({ error: 'Missing required fields: jobId, filename, fileContent' });
  }

  try {
    // ServiceM8 API expects base64-encoded file content
    // The fileContent should already be base64 from the blob conversion
    const response = await fetch(
      `https://api.servicem8.com/api_1.0/job/${jobId}/file.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SM8_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: filename,
          data: fileContent, // base64-encoded
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SM8 upload error:', errorText);
      return res.status(response.status).json({
        error: 'Failed to upload to ServiceM8',
        details: errorText,
        status: response.status,
      });
    }

    const result = await response.json();

    return res.status(200).json({
      success: true,
      message: 'Quote uploaded to ServiceM8',
      jobId,
      filename,
      sm8Response: result,
    });
  } catch (error) {
    console.error('SM8 upload error:', error);
    return res.status(500).json({
      error: 'Failed to upload to ServiceM8',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
