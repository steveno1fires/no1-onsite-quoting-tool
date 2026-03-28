// Upload files (PDF / Excel) to a ServiceM8 job as attachments

const SM8_API_KEY = process.env.SM8_API_KEY || 'smk-a5f784-6ea17ab17249c972-707b5ecb521890de';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const jobUuid = req.body.jobUuid || req.body.jobId;
  const filename = req.body.filename;
  const fileBase64 = req.body.fileBase64 || req.body.fileContent;

  if (!jobUuid || !filename || !fileBase64) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Determine MIME type from extension
  let contentType = 'application/pdf';
  if (filename.endsWith('.xlsx')) {
    contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }

  try {
    const fileBuffer = Buffer.from(fileBase64, 'base64');

    // Step 1: Create the attachment record on the job
    const createRes = await fetch('https://api.servicem8.com/api_1.0/Attachment.json', {
      method: 'POST',
      headers: {
        'X-Api-Key': SM8_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        related_object: 'job',
        related_object_uuid: jobUuid,
        attachment_name: filename,
        attachment_source: 'staff',
        file_type: contentType,
        active: 1,
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      console.error('SM8 create attachment error:', errText);
      return res.status(createRes.status).json({ error: 'Failed to create attachment', details: errText });
    }

    // Step 2: Extract attachment UUID from Location header
    const locationHeader = createRes.headers.get('Location') || createRes.headers.get('x-record-uuid') || '';
    let attachmentUuid = '';
    const match = locationHeader.match(/([0-9a-f-]{36})/i);
    if (match) attachmentUuid = match[1];

    if (!attachmentUuid) {
      try {
        const body = await createRes.json();
        attachmentUuid = body.uuid || body.UUID || '';
      } catch {}
    }

    // Step 3: Upload the actual file binary
    if (attachmentUuid) {
      const uploadRes = await fetch(
        `https://api.servicem8.com/api_1.0/Attachment/${attachmentUuid}.file`,
        {
          method: 'POST',
          headers: {
            'X-Api-Key': SM8_API_KEY,
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${filename}"`,
          },
          body: fileBuffer,
        }
      );

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        console.error('SM8 file upload error:', errText);
        return res.status(uploadRes.status).json({ error: 'Failed to upload file content', details: errText });
      }
    }

    return res.status(200).json({ success: true, jobUuid, filename, attachmentUuid });
  } catch (error) {
    console.error('SM8 upload error:', error);
    return res.status(500).json({
      error: 'Failed to upload to ServiceM8',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
