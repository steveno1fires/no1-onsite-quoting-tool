// Upload generated files (PDF / Excel) to ServiceM8 job record

const SM8_API_KEY = process.env.SM8_API_KEY || 'smk-a5f784-6ea17ab17249c972-707b5ecb521890de';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Accept both old field names and new ones
  const jobUuid = req.body.jobUuid || req.body.jobId;
  const filename = req.body.filename;
  const fileBase64 = req.body.fileBase64 || req.body.fileContent;

  if (!jobUuid || !filename || !fileBase64) {
    return res.status(400).json({ error: 'Missing required fields: jobUuid, filename, fileBase64' });
  }

  // Determine MIME type from filename extension
  let contentType = 'application/pdf';
  if (filename.endsWith('.xlsx')) {
    contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  } else if (filename.endsWith('.xls')) {
    contentType = 'application/vnd.ms-excel';
  } else if (filename.endsWith('.csv')) {
    contentType = 'text/csv';
  }

  try {
    // Upload as multipart form data with the binary file
    const fileBuffer = Buffer.from(fileBase64, 'base64');

    const boundary = '----FormBoundary' + Date.now().toString(36);
    const bodyParts = [
      `--${boundary}\r\n`,
      `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`,
      `Content-Type: ${contentType}\r\n\r\n`,
    ];

    const headerBuffer = Buffer.from(bodyParts.join(''));
    const footerBuffer = Buffer.from(`\r\n--${boundary}--\r\n`);
    const multipartBody = Buffer.concat([headerBuffer, fileBuffer, footerBuffer]);

    const response = await fetch(
      `https://api.servicem8.com/api_1.0/Attachment.json`,
      {
        method: 'POST',
        headers: {
          'X-Api-Key': SM8_API_KEY,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
        },
        body: multipartBody,
      }
    );

    if (!response.ok) {
      // Fallback: try JSON-based upload
      const jsonResponse = await fetch(
        `https://api.servicem8.com/api_1.0/Attachment.json`,
        {
          method: 'POST',
          headers: {
            'X-Api-Key': SM8_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            related_object: 'job',
            related_object_uuid: jobUuid,
            file_name: filename,
            file_type: contentType,
            attachment_source: 'staff',
            attachment_name: filename,
            file_content: fileBase64,
            active: 1,
          }),
        }
      );

      if (!jsonResponse.ok) {
        const errorText = await jsonResponse.text();
        console.error('SM8 upload error:', errorText);
        return res.status(jsonResponse.status).json({
          error: 'Failed to upload to ServiceM8',
          details: errorText,
          status: jsonResponse.status,
        });
      }

      const result = await jsonResponse.json();
      return res.status(200).json({ success: true, jobUuid, filename, sm8Response: result });
    }

    const result = await response.json();
    return res.status(200).json({ success: true, jobUuid, filename, sm8Response: result });
  } catch (error) {
    console.error('SM8 upload error:', error);
    return res.status(500).json({
      error: 'Failed to upload to ServiceM8',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
