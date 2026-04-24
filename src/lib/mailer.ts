import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (to: string, resetUrl: string) => {
  const mailOptions = {
    from: `"Elite Workouter" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Reset - Elite Workouter',
    html: `
      <div style="font-family: 'Inter', sans-serif; background-color: #121212; color: #ffffff; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #CCFF00; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">Elite Workouter</h1>
        </div>
        <div style="background-color: #1e1e1e; padding: 30px; border-radius: 8px;">
          <h2 style="margin-top: 0; color: #ffffff;">Password Reset Request</h2>
          <p style="color: #aaaaaa; line-height: 1.6;">
            We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetUrl}" style="background-color: #CCFF00; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #aaaaaa; font-size: 14px; line-height: 1.6;">
            This link will expire in 15 minutes for your security.
          </p>
          <hr style="border-color: #333; margin: 30px 0;" />
          <p style="color: #666666; font-size: 12px; text-align: center;">
            If you're having trouble clicking the password reset button, copy and paste the URL below into your web browser:<br/><br/>
            <a href="${resetUrl}" style="color: #CCFF00;">${resetUrl}</a>
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
