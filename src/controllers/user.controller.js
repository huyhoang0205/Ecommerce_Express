'use strict'

const { SuccessResponse } = require("../cores/success.response");
const {
    newUser,
    checkLoginEmailTokenService,
    userHandleRefreshToken,
    userLogin
} = require('../services/user.service')

class UserController {
    
    newUser = async(req, res, next) => {
        new SuccessResponse({
            message: 'User Register Successfully!',
            metadata: await newUser({
                email: req.body.email
            })
        }).send(res)
    }

    checkLoginEmailToken = async(req, res, next) => {
        new SuccessResponse({
            message: 'Verify Email! --- redirect front-end  if exists',
            metadata: await checkLoginEmailTokenService({
                token: req.query.token
            })
        }).send(res)
    }

    userLogin = async(req, res, next) => {
        new SuccessResponse({
            message: 'Logout Success !',
            metadata: await userLogin(req.body)
        }).send(res)
    }

    userHandleRefreshToken = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get new access token for user successfully !',
            metadata: await userHandleRefreshToken({
                refreshToken : req.refreshToken,
                user : req.user,
                keyStore: req.keyStore,
            })
        }).send(res)
    }
}

module.exports = new UserController();