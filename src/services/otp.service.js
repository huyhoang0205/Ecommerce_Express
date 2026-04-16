'use strict'

const crypto = require('crypto')
const OTP = require('../models/otp.model')
const { NotFoundError } = require('../cores/error.response')
const generatorTokenRandom = () => {
    const token = crypto.randomInt(0, Math.pow(2,32))

    return token
}

const newOtp = async ({
    email
}) => {
    const token = generatorTokenRandom()
    const newToken = await OTP.create({
        otp_token: token,
        otp_email: email
    })
    return newToken
}

const checkEmailToken = async ({token}) => {
    const tokenholder = await OTP.findOne({
        otp_token: token
    })
    if(!tokenholder) throw new NotFoundError('OTP Not Found')
    OTP.findOneAndDelete( {otp_token: token} ).then()
    return tokenholder
}

module.exports ={
    newOtp,
    checkEmailToken
}