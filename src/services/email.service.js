'use strict'

const {getTemplate}  = require('./template.service')
const { newOtp } = require("./otp.service")
const {transporter} = require('../dbs/init.nodemailler')
const { NotFoundError } = require('../cores/error.response')
const { replacePlaceholder } = require('../utils')
const {app:{host,port},email: {user}} = require('../configs')

const sendEmailLinkVerify = ({
    html,toEmail,subject = "Xác nhận Email đăng ký", text = 'xác nhận....'
}) => {
    try {
        const mailOption = {
            from: `"Hệ thống xác nhận" <${user}>`,
            to: toEmail,
            subject,
            text,
            html
        }
        transporter.sendMail(mailOption, (err, info) => {
            if(err) {
                return console.log(err)
            }
            console.log('Message sent', info.messageId)
        })
    }catch (e) {
        console.error(`error send Email::`, e)
        return e
    }
}


const sendEmailToken = async ({
    email = null
}) => {
    try {
        //generator token
        const token = await newOtp({email})
        
        //template
        const template = await getTemplate({
            temp_name: 'HTML EMAIL TOKEN'
        })

        if(!template) {
            throw new NotFoundError('Template Not Found')
        }

        const content = replacePlaceholder(
            template.temp_html,
            {
                link_verify: (host === 'localhost'? 
                    `http://${host}:${port}/v1/api/user/welcome-back?token=${token.otp_token}` :
                    `https://${host}:${port}/v1/api/user/welcome-back?token=${token.otp_token}`)
            }
        )
        sendEmailLinkVerify({
            html: content,
            toEmail: email,
            subject: 'Vui Lòng xác nhận địa chỉ Email đăng ký',

        })

    } catch(e) {
        console.log("sendEmailToken in emailService Error::::",e)
    }
}

module.exports = {
    sendEmailToken
}