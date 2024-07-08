// mailer.js
const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const { mailConfigurations } = require("../../config");

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service provider
  auth: {
    user: mailConfigurations.emailUser,
    pass: mailConfigurations.emailPassword,
  },
});

/**
 * Send Mail
 *
 * Function to send an email
 * @param {string} to - The email address of the recipient
 * @param {string} subject - The subject of the email
 * @param {string} text - The text body of the email
 * @param {HTML} html - The HTML body of the email
 * @returns - The response object
 */
const sendMail = async (to, subject, text, htmlPath, variables) => {
  try {
    // Read the HTML template
    let htmlTemplateToSend = fs.readFileSync(htmlPath, "utf8");

    if (variables) {
      // Compile the Handlebars template
      const template = handlebars.compile(htmlTemplateToSend);
      htmlTemplateToSend = template(variables);
    }

    const info = await transporter.sendMail({
      from: mailConfigurations.emailUser, // Sender address
      to: to, // List of recipients
      subject: subject, // Subject line
      text: text, // Plain text body
      html: htmlTemplateToSend, // HTML body
    });
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendMail;
