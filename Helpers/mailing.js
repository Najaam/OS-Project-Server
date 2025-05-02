import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env
    pass: process.env.EMAIL_PASS, // Your email password from .env
  },
});

/**
 * Sends a welcome email to a new user.
 * @param {string} username - The user's name.
 * @param {string} email - The user's email.
 */


async function sendWelcomeEmail(username, email) {
  const mailOptions = {
    from: `"Jade Os" <${process.env.EMAIL_USER}>`, // Sender address
    to: email, // Recipient's email
    subject: "Welcome to Our Platform",
    text: `Hello ${username},\n\nCongratulations on creating your account with Jade Virtual OS! We're excited to have you join the future of virtual computing. With Jade Virtual OS, you can explore new possibilities and enjoy a unique, seamless virtual experience that’s tailored just for you.\n\nIf you have any questions or need assistance, our support team is always here to help.\n\nWelcome aboard and enjoy your journey in the virtual world!\n\nBest regards,\nThe Jade Virtual OS Team`,
    html: `
      <h1>Welcome to Jade Virtual OS, ${username}!</h1>
      <p>Congratulations on creating your account with Jade Virtual OS! We're thrilled to have you join the future of virtual computing.</p>
      <p>With Jade Virtual OS, you can explore new possibilities and enjoy a unique, seamless virtual experience designed just for you.</p>
      <p>If you have any questions or need assistance, feel free to reach out to our <a href="mailto:support@jadeos.com">support team</a>.</p>
      <p><strong>Welcome aboard and enjoy your journey in the virtual world!</strong></p>
      <p>Best regards,<br>The Jade Virtual OS Team</p>
    `,    
  };

  await transporter.sendMail(mailOptions);
}

const sendOtpEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Jade Os" <${process.env.EMAIL_USER}>`, // Sender address
      to: email, // Recipient's email
      subject: "Your OTP Code",
      text: `Hello,\n\nYour OTP code for verifying your account with Jade Virtual OS is: ${otp}\n\nPlease use this code to complete your verification process.\n\nBest regards,\nThe Jade Virtual OS Team`,
      html: `
        <h1>Your OTP Code</h1>
        <p>Hello,</p>
        <p>Your OTP code for verifying your account with Jade Virtual OS is: <strong>${otp}</strong></p>
        <p>Please use this code to complete your verification process.</p>
        <p>Best regards,<br>The Jade Virtual OS Team</p>
      `,
    };

    const transporter = nodemailer.createTransport({
      service: "Gmail", // or another email provider
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    await transporter.sendMail(mailOptions); // Send the email
  } catch (err) {
    console.error("Error in sendOtpEmail:", err);
    throw new Error("Failed to send OTP email."); // Throw error if email sending fails
  }
};

export { sendWelcomeEmail,sendOtpEmail  };
