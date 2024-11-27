// export const setreminder= async (req,res)=>{
//     const { date, email } = req.body;
//     try {
//         await db.query('INSERT INTO appointments (date, email) VALUES ($1, $2)', [date, email]);
//         res.send('Appointment booked successfully!');
//     } catch (err) {
//         console.error('Error saving appointment:', err);
//         res.status(500).send('Error saving appointment');
//     }

// }
import pg from "pg";
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "cfg",
    password: "antrikshj_09",
    port: 5432,
  });
  db.connect();
import nodemailer from "nodemailer";
export const sendReminder= async (req,res)=>{
    const { emails, subject, message } = req.body;
    if (!emails || emails.length === 0) {
    return res.status(400).json({ success: false, error: "No recipients defined" });
  }
    try {
      // Create a transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ajain_be22@thapar.edu", // Your Gmail
          pass: "hhuj lxtp hwcj uadn",   // Your App Password
        },
      });
  
      // Define email options
      const mailOptions = {
        from: "ajain_be22@thapar.edu",
        to: emails, // Array of email addresses
        subject: subject,
        text: message,
        html: `<p>${message}</p>`,
      };
  
      // Send email
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ success: true, message: "Emails sent successfully!" });
    } catch (error) {
      console.error("Error sending emails:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }