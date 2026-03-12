'use strict'

const keyTokenModel = require('../models/keyToken.model')
const { Types } = require('mongoose')

class keyTokenService {

    static createKeyToken = async ({userId , publicKey , privateKey , refreshToken}) => {
        try {

            const filter = {user: userId} , update = {
                publicKey , privateKey , refreshTokensUsed: [] , refreshToken , 
            } , options = {upsert: true , new: true}

            const tokens = await keyTokenModel.findOneAndUpdate(filter , update , options)

            return tokens ? tokens : null;
        }
        catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({user: new Types.ObjectId(userId)})
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne(id)
    }

    static findByRefreshTokensUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshToken : refreshToken})
    }

    static deleteKeyById = async ({userId}) => {
        return await keyTokenModel.deleteOne({user: userId})
    }
}

module.exports = keyTokenService;