const express = require("express");
const routerMail = express.Router();

const sgMail = require('../config/sendgrid')

routerMail.post('/', (req, res) => {
    const {to, subject, html } = req.body;

    const msg = {
        to,
        from: 'davidorquera028@gmail.com',
        subject,
        html
    }

    sgMail.send(msg)
    .then(res.status(201).send({ success: true}))
    .catch(err => { res.status(err.code).send(err.message) })

});

module.exports = routerMail;