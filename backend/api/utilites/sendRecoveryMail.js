import nodemailer from "nodemailer";

export const sendRecoveryMail = async (userEmail, recoveryLink) => {
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
      subject: "WDAR Estate Password Reset",
      html: `
        <h1 style="font-size:26px;">Reset Password</h1>
        <p style="font-size:18px;">Click on the following link to reset your password:</p>
        <p><a href="${recoveryLink}" style="text-decoration:none;background-color:rgb(255, 95, 31); padding:8px; color:white; font-weight:500; font-size:20px">Reset Password</a>.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Log a success message if the email is sent successfully
    console.log("Recovert email sent successfully");
  } catch (error) {
    // Log an error message if there is an issue sending the email
    console.error("Error sending recovery email:", error);
  }
};
