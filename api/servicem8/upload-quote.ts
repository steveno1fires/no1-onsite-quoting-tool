// Upload files (PDF / Excel) to a ServiceM8 job as attachments
// SM8 docs: https://developer.servicem8.com/docs/attaching-files-to-a-job-diary

const SM8_API_KEY = process.env.SM8_API_KEY || 'smk-a5f784-6ea17ab17249c972-707b5ecb521890de';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const jobUuid = req.body.jobUuid || req.body.jobId;
  const filename = req.body.filename;
  const fileBase64 = req.body.fileBase64 || req.body.fileContent;
  const caption = req.body.caption; // optional caption for the attachment

  if (!jobUuid || !filename || !fileBase64) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // SM8 expects file_type as the extension with dot, e.g. ".pdf", ".xlsx"
  const extMatch = filename.match(/\.[^.]+$/);
  const fileExtension = extMatch ? extMatch[0] : '.pdf';

  try {
    const fileBuffer = Buffer.from(fileBase64, 'base64');

    // Step 1: Create the attachment record
    const createRes = await fetch('https://api.servicem8.com/api_1.0/Attachment.json', {
      method: 'POST',
      headers: {
        'X-Api-Key': SM8_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        related_object: 'job',
        related_object_uuid: jobUuid,
        attachment_name: caption || filename,
        file_type: fileExtension,
        attachment_source: 'staff',
        active: 1,
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      console.error('SM8 create attachment error:', createRes.status, errText);
      return res.status(createRes.status).json({ error: 'Failed to create attachment record', details: errText });
    }

    // Step 2: Get the attachment UUID from the response
    let attachmentUuid = '';
    const locationHeader = createRes.headers.get('x-record-uuid') || createRes.headers.get('Location') || '';
    const uuidMatch = locationHeader.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
    if (uuidMatch) {
      attachmentUuid = uuidMatch[1];
    }

    if (!attachmentUuid) {
      try {
        const body = await createRes.json();
        attachmentUuid = body.uuid || body.UUID || '';
      } catch {}
    }

    if (!attachmentUuid) {
      return res.status(500).json({ error: 'Could not get attachment UUID from SM8 response' });
    }

    // Step 3: Upload the actual file binary to the attachment
    // Use correct content type for images so SM8 can display them
    const contentTypeMap: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.jpeg': 'image/jpeg',
      '.jpg': 'image/jpeg',
      '.png': 'image/png',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    const uploadContentType = contentTypeMap[fileExtension.toLowerCase()] || 'application/octet-stream';

    const uploadRes = await fetch(
      `https://api.servicem8.com/api_1.0/Attachment/${attachmentUuid}.file`,
      {
        method: 'POST',
        headers: {
          'X-Api-Key': SM8_API_KEY,
          'Content-Type': uploadContentType,
        },
        body: fileBuffer,
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error('SM8 file upload error:', uploadRes.status, errText);
      return res.status(uploadRes.status).json({ error: 'Failed to upload file binary', details: errText });
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
