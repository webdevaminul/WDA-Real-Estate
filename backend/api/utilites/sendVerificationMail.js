import nodemailer from "nodemailer";

export const sendVerificationEmail = async (userEmail, verificationLink) => {
  try {
    // Create a transporter object
    const transporter = nodemailer.createTransport({
      service: "Gmail",
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
      html: `
      <h1 style="font-size:26px;">Welcome to <span style="color:rgb(128, 139, 150)">WDA</span><span style="color:rgb(255, 95, 31)">R Estate</span></h1>
      <p style="font-size:18px;">To complete your registration, please verify your email by clicking the button below.</p>
      <p><a href="${verificationLink}" style="text-decoration:none;background-color:rgb(255, 95, 31); padding:8px; color:white; font-weight:500; font-size:20px">Verify & Sign in</a>.</p>
      
      `,
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
