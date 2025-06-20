import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string; // Optional plain text version
}

// Ensure environment variables are loaded. For Next.js, they are typically available globally.
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL;

let transporter: nodemailer.Transporter | null = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS && SMTP_FROM_EMAIL) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports like 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    // Optional: Add TLS options if needed, e.g., for self-signed certificates
    // tls: {
    //   rejectUnauthorized: false // Use only for development/testing with self-signed certs
    // }
  });

  // Verify transporter configuration (optional, good for startup diagnostics)
  transporter.verify((error, success) => {
    if (error) {
      console.error('Email transporter configuration error:', error.message);
      // Prevent app from starting or disable email functionality if critical
      // For now, just log it. The sendEmail function will also fail.
      transporter = null; // Invalidate transporter if config is bad
    } else {
      console.log('Email transporter configured successfully. Ready to send emails.');
    }
  });

} else {
  console.warn(
    'SMTP environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL) are not fully configured. ' +
    'Email functionality will be disabled.'
  );
}

/**
 * Sends an email using the pre-configured nodemailer transporter.
 * @param options - Email options: to, subject, htmlBody, and optional textBody.
 * @throws Error if email sending fails or if transporter is not configured.
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!transporter) {
    const errorMessage = 'Email transporter is not configured due to missing SMTP environment variables. Email not sent.';
    console.error(errorMessage, { to: options.to, subject: options.subject });
    // Depending on desired behavior, you might want to throw an error
    // or silently fail in dev if email is not critical. For password reset, it is critical.
    throw new Error(errorMessage);
  }

  const mailOptions = {
    from: `"Jules Hotel Management" <${SMTP_FROM_EMAIL}>`, // Sender address
    to: options.to, // List of receivers
    subject: options.subject, // Subject line
    text: options.textBody || options.htmlBody.replace(/<[^>]*>?/gm, ''), // Plain text body (fallback or alternative)
    html: options.htmlBody, // HTML body content
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully: %s', info.messageId);
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // Only for Ethereal accounts
  } catch (error) {
    const castedError = error as Error;
    console.error('Error sending email:', castedError.message);
    console.error('Details:', castedError); // Log the full error object for more details
    throw new Error(`Failed to send email: ${castedError.message}`);
  }
}
