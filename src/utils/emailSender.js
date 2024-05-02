const sgMail = require("@sendgrid/mail");
require("dotenv").config({ path: require("find-config")(".env") });
const fromEmail = process.env.NODE_MAILER_FROM;
const CONTACT_US_EMAIL = process.env.CONTACT_US_EMAIL;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (emailTo, emailSubject, emailTemplate) => {
  try {
    const message = {
      to: emailTo,
      from: fromEmail,
      subject: emailSubject,
      html: emailTemplate,
    };

    const info = await sgMail.send(message);
    //console.log("Return message from twilio sendGrid is",info[0]);
    if (info[0].statusCode === 202) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Oops! some error occurred on sendEmail(). Error is: ", error);
    return false;
  }
};

const sendContactUsEmail = async (emailFrom, emailSubject, emailTemplate) => {
  try {
    const message = {
      to: CONTACT_US_EMAIL,
      from: emailFrom,
      subject: emailSubject,
      html: emailTemplate,
    };

    const info = await sgMail.send(message);
    //console.log("Return message from twilio sendGrid is",info[0]);
    if (info[0].statusCode === 202) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Oops! some error occurred on sendEmail(). Error is: ", error);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendContactUsEmail,
};
