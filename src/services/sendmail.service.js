const nodemailer = require('nodemailer')


module.exports.SendMailText = (_to, _subject, _text) => {
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            // service: "gmail",
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL, // generated ethereal user
                pass: process.env.EMAILPASSWORD, // generated ethereal password
            },
        });

        // send mail with defined transport object
        transporter.sendMail({
            from: process.env.EMAIL, // sender address
            to: _to, // list of receivers
            subject: _subject, // Subject line
            text: _text, // plain text body
        })
            .then(rel => resolve(rel))
            .catch(err => reject(err))
    });

}

module.exports.SendMailHTML = (_to, _subject, _html) => {
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            // service: "gmail",
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL, // generated ethereal user
                pass: process.env.EMAILPASSWORD, // generated ethereal password
            },
        });

        // send mail with defined transport object
        transporter.sendMail({
            from: process.env.EMAIL, // sender address
            to: _to, // list of receivers
            subject: _subject, // Subject line
            html: _html, // html body
        })
            .then(rel => resolve(rel))
            .catch(err => reject(err))
    });

}