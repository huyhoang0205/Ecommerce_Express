'use strict'

const AccessesService = require('../services/accesses.service')
const { SuccessResponse, CREATED } = require('../cores/success.response')
class AccessesController {

    handleRefreshToken = async (req , res , next) => {
        new SuccessResponse({
            message : "Get new access token success !",
            metadata : await AccessesService.handleRefreshToken({
                refreshToken : req.refreshToken,
                user : req.user,
                keyStore: req.keyStore,
            })
        }).send(res)
    }

    logout = async (req , res , next) => {
        new SuccessResponse({
            message : "Logout Success !",
            metadata : await AccessesService.logout(req.keyStore),
        }).send(res);
    }

    login = async (req , res , next) => {
        new SuccessResponse({
            message : "Login Success !",
            metadata : await AccessesService.login(req.body)
        }).send(res)
    }


    signUp = async (req, res, next) => {
        new CREATED({
            message : "Register Success !",
            metadata : await AccessesService.signup(req.body)
        }).send(res)
    }
}

module.exports = new AccessesController()