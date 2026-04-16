'use strict'

const nodemailer = require('nodemailer')
const {email:{user,password}} = require('../configs')

const  transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user, // Email của bạn
    pass:  password // Mật khẩu ứng dụng vừa tạo
  },
//   tls: {
//     rejectUnauthorized: false
//   }
});


module.exports = {
    transporter
}