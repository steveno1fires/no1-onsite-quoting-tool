// src/api/email/send-quote.ts
// Placeholder for email sending via SendGrid or Gmail API
// TODO: Implement with SendGrid API (recommended) or Gmail API

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, filename, fileContent, customerName } = req.body;

  if (!email || !filename || !fileContent) {
    return res.status(400).json({ error: 'Missing required fields: email, filename, fileContent' });
  }

  try {
    // TODO: Implement email sending
    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // 
    // const msg = {
    //   to: email,
    //   from: 'noreply@no1fires.co.uk',
    //   subject: `Your No1 Fires Quote - ${customerName}`,
    //   html: '<p>Please find your quote attached.</p>',
    //   attachments: [
    //     {
    //       content: Buffer.from(fileContent, 'base64').toString('base64'),
    //       filename: filename,
    //       type: 'application/pdf',
    //       disposition: 'attachment'
    //     }
    //   ]
    // };
    // 
    // await sgMail.send(msg);

    // For now, return success (email sending not yet implemented)
    console.log(`[PLACEHOLDER] Would send quote ${filename} to ${email}`);

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully (placeholder)',
      email,
      filename,
    });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
