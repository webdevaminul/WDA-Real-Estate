import nodemailer from "nodemailer";

export const sendVerificationEmail = async (userEmail, verificationLink) => {
  try {
    // Create a transporter object
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define the email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "WDAR Estate Account Verification",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email and complete your registration.</p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Log a success message if the email is sent successfully
    console.log("Verification email sent successfully");
  } catch (error) {
    // Log an error message if there is an issue sending the email
    console.error("Error sending verification email:", error);
  }
};
