const sgMail = require('@sendgrid/mail');
const config = require("./setting")

sgMail.setApiKey(config.SENGRID_API_KEY);

module.exports = sgMail;