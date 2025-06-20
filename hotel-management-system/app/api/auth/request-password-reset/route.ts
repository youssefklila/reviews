import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail } from '@/lib/emailUtils'; // Assuming @/lib resolves
import { randomUUID } from 'crypto'; // For generating placeholder token

// Zod schema for request validation
const requestPasswordResetSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = requestPasswordResetSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: 'Invalid input.',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // --- TODO: Database Interaction ---
    // 1. Check if user with this email exists in the database.
    //    const user = await prisma.user.findUnique({ where: { email } });
    //    if (!user) {
    //      // Return a generic message to avoid exposing whether an email is registered
    //      return NextResponse.json({ message: "If an account with this email exists, a password reset link has been sent." }, { status: 200 });
    //    }
    console.log(`Password reset requested for email: ${email}. TODO: Check user existence.`);

    // 2. Generate a unique password reset token.
    const placeholderToken = randomUUID(); // Using crypto.randomUUID for a secure placeholder
    console.log(`Generated placeholder reset token: ${placeholderToken}. TODO: Store token with expiry for user.`);

    // 3. Store the token and its expiry associated with the user in the database.
    //    await prisma.passwordResetToken.create({
    //      data: {
    //        userId: user.id,
    //        token: hashedToken, // Store a hashed version of the token
    //        expiresAt: new Date(Date.now() + 3600000), // e.g., 1 hour expiry
    //      },
    //    });
    // --- End of TODO: Database Interaction ---

    // Construct Reset Link
    const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000'; // Fallback for local dev
    const resetLink = `${appBaseUrl}/reset-password?token=${placeholderToken}`;

    // Send Email
    const emailSubject = 'Password Reset Request - Jules Hotel Management';
    const emailHtmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset the password for your account associated with this email address.</p>
        <p>If you made this request, please click the link below to reset your password. This link will expire in 1 hour (actual expiry to be implemented).</p>
        <p style="margin: 20px 0;">
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Your Password
          </a>
        </p>
        <p>If the button above doesn't work, copy and paste the following URL into your web browser:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        <p>Thanks,</p>
        <p>The Jules Hotel Management Team</p>
      </div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: emailSubject,
        htmlBody: emailHtmlBody,
      });
      // Return a generic message to avoid user enumeration (whether an email is registered or not)
      return NextResponse.json({ message: "If an account with this email exists, a password reset link has been sent." }, { status: 200 });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Even if email sending fails, we might still return a generic success message to the client
      // to prevent leaking information about system status or email validity.
      // However, for internal logging, this is a critical error.
      // For this implementation, let's indicate a server error if email fails.
      return NextResponse.json({ message: "Could not send password reset email due to a server error. Please try again later." }, { status: 500 });
    }

  } catch (error) {
    if (error instanceof SyntaxError) { // Malformed JSON
      return NextResponse.json({ message: 'Invalid JSON format in request body.' }, { status: 400 });
    }
    console.error('Request password reset error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
