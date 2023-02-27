const nodeMailer = require("nodemailer")

const transporter = nodeMailer.createTransport( {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'issac.beatty90@ethereal.email',
        pass: 'P7CfjekTnu71djHgdk'
    }
} )

module.exports = transporter