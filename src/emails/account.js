const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailOwner = "lioncourtvictor2@gmail.com";

const sendRegistrationEmail = async (email, name) => {
  try {
    await sgMail.send({
      from: emailOwner,
      subject: "Welcome!!",
      to: email,
      text: `Thank you ${name} for your suscription!!!!`,
    });
  } catch (error) {
    console.error(error);
  }
};

const sendCancelationEmail = async (email, name) => {
  try {
    await sgMail.send({
      from: emailOwner,
      subject: "Bye!!",
      to: email,
      text: `Hello ${name} your account has been removed`,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendRegistrationEmail, sendCancelationEmail };
