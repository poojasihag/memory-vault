import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const getHtmlTemplate = (title: string, content: string) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>\${title}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4ece4; margin: 0; padding: 40px 20px; color: #2d2d2d;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #fdfaf6; border-radius: 12px; overflow: hidden; border: 1px solid #d8c7be; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <tr>
                <td style="background-color: #e8ded2; padding: 30px; text-align: center; border-bottom: 1px solid #d8c7be;">
                    <h1 style="font-family: Georgia, serif; color: #8b3a3a; margin: 0; font-size: 28px; letter-spacing: 1px;">Memory Vault</h1>
                    <p style="margin: 5px 0 0 0; font-size: 11px; color: #7a6a5a; letter-spacing: 2px;">EST. 1994</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 40px 30px; line-height: 1.6; font-size: 15px;">
                    <h2 style="font-family: Georgia, serif; color: #3b2f2f; margin-top: 0; font-size: 22px;">\${title}</h2>
                    \${content}
                </td>
            </tr>
            <tr>
                <td style="background-color: #e8ded2; padding: 20px; text-align: center; border-top: 1px solid #d8c7be;">
                    <p style="margin: 0; font-size: 12px; color: #7a6a5a;">&copy; \${new Date().getFullYear()} Memory Vault — A Digital Heirloom.</p>
                    <p style="margin: 5px 0 0 0; font-size: 11px; color: #9c8e82;">If you didn't request this, you can safely ignore this email.</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
    try {
        const info = await transporter.sendMail({
            from: \`"Memory Vault" <\${process.env.SMTP_USER}>\`,
            to,
            subject,
            text,
            html,
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email: ", error);
        throw new Error("Failed to send email");
    }
};

export default transporter;
