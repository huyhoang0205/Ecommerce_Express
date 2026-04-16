'use strict'

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION : 'x-access-token',
    REFRESH_TOKEN : 'x-rtoken-id'
}

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError,
        NotFoundError,
} = require('../cores/error.response')


// import service
const KeyTokenService = require('../services/keyToken.service')

const createKeyPair = async ( payload , publicKey , privateKey ) => {
    try {
        //accessToken 
        const {userId, email} = payload
        const accessToken = await JWT.sign(payload , publicKey , {
            expiresIn: '2 days',
        })
        //refreshToken
        const refreshToken = await JWT.sign(payload , privateKey , {
            expiresIn: '7 days',
        })

        JWT.verify(accessToken , publicKey , (err , decoded) => {
            if(err) {
                console.error("verification failed:: ", err);
            }else {
                console.log("verification successful:: ", decoded);
            }
        })

        return {accessToken , refreshToken}
    }
    catch (error) {
        console.log('create Token fail::::',error)
    }
}


const authenticationV2 = asyncHandler( async (req , res , next) => {
    console.log("header::::::",req.headers)
    const userId = req.headers[HEADER.CLIENT_ID];
    if(!userId) {
        throw new AuthFailureError("Invalid Request! Missing userId in header!")
    }

    const keyStore = await KeyTokenService.findByUserId(userId);
    if(!keyStore) {
        throw new NotFoundError("Not found keyStore!")
    }

    if(req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
            const decodeUser = JWT.verify(refreshToken , keyStore.privateKey);
            if(decodeUser.userId !== userId) {
                throw new AuthFailureError("Invalid User !")
            }

            // attack field to req for service behind authentication
            req.keyStore = keyStore; 
            req.user = decodeUser;
            req.refreshToken = refreshToken;

            return next();

        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    console.log("accesstoken:::::", accessToken)
    if(!accessToken) {
        throw new AuthFailureError("Invalid Request! Missing accessToken in header!")
    }

    try {
        const decodeUser = JWT.verify(accessToken , keyStore.publicKey);
        if(decodeUser.userId !== userId) {
            throw new AuthFailureError("Invalid User !")
        }
        req.keyStore = keyStore; // save keyStore to req for use in logout and other function in services
        req.user = decodeUser

        return next();
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token , keySecret) => {
    return await JWT.verify(token , keySecret)
}

module.exports = {
    createKeyPair,
    authenticationV2,
    verifyJWT,
}