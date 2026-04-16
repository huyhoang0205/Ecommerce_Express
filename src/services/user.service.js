'use strict'

const {
    BadRequestError
} = require('../cores/error.response')

const {sendEmailToken} = require('./email.service')
const USER = require('../models/user.model')
const { checkEmailToken } = require('./otp.service')

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { createUser, findByEmail } = require('../models/repositories/user.repo')
const keyTokenService = require('./keyToken.service')
const { createKeyPair,
 } = require('../auths/auth.Util')
const { getInfoData } = require('../utils')
const { getRoleIdByName } = require('../models/repositories/role.repo')

const ROLE_CONSTANT = require('../constant/role.constant')

const newUser = async({
    email=null,
    capcha=null
}) => {
    const user = await USER.findOne({email}).lean()

    if(user) {
        throw new BadRequestError('Email already exists')
    }

    const result = await sendEmailToken({
        email
    })
    return {token: result} 
}

const checkLoginEmailTokenService = async ({
    token
}) => {
    const {otp_email: email, otp_token} = await checkEmailToken({token})
    if(!email) throw new BadRequestError('Token Not Found')
    
    const hasUser = await findUserByEmailWithLogin({
        email
    })
    if(hasUser) throw new BadRequestError('Email already exists')

    try {
        const passwordHash = await bcrypt.hash(email,10);
        const user_role = await getRoleIdByName(ROLE_CONSTANT.USER)
        console.log('role in checkLoginEmailTokenService:::',user_role)
        const newUser = await createUser({
            user_name: email,
            user_slug: 'fake_slug',
            user_email: email,
            user_password: passwordHash,
            user_role
        })
        
        if(newUser) {
            const publicKey = crypto.randomBytes(64).toString('hex');
            const privateKey = crypto.randomBytes(64).toString('hex');

            // store publicKey to collection KeyToken in MongoDB
            const keyStore = await keyTokenService.createKeyToken({
                userId: newUser._id,
                publicKey,
                privateKey
            })
            
            if(!keyStore) {
                return {
                    code : "xxxx",
                    message : "keyToken Store error!",
                }
            }
            // JWT
            const tokens = await createKeyPair({userId: newUser._id , email , role: ROLE_CONSTANT.USER} , keyStore.publicKey , keyStore.privateKey)
            return {
                code : 201,
                metadata : {
                    user : getInfoData({fields: ['_id', 'user_id','user_name' , 'user_email'], object: newUser}),
                    tokens,
                    password: email,
                }
            }
        }
        return {
            code : 201,
            metadata : null
        }
    }catch(e) {
        console.log("error in checkLoginEmailTokenService:::",e)
    }
}

const findUserByEmailWithLogin = async({
    email
}) => {
    const user = await USER.findOne({user_email: email}).lean()
    return user
}

const userHandleRefreshToken = async ({refreshToken , user ,keyStore}) => {

        const {userId , email} = user;

        if(keyStore.refreshTokensUsed.includes(refreshToken)) {
            await keyTokenService.deleteKeyById({userId})
            throw new ForbiddenError("Refresh token reuse detected! Pls re-login!")
        }

        if(keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError("User not found with this refresh token!")
        }

        const foundUser = await findByEmail(email);

        console.log('[2]:::' , {userId , email})

        if(!foundUser) {
            throw new AuthFailureError("User not found with this refresh token!")
        }

        //create new accessToken and refreshToken
        const tokens = await createKeyPair({userId , email, role: ROLE_CONSTANT.USER}, keyStore.publicKey , keyStore.privateKey)

        //update accessToken and refreshToken in DB
        await keyStore.updateOne({
            $set : {
                refreshToken: tokens.refreshToken,
            },
            $addToSet : {
                refreshTokensUsed: refreshToken,
            }
        })

        return {
            user,
            tokens,
        } 
    }

    
    const userLogin = async ( {email , password , refreshToken = null}) => {
            const foundUser = await findByEmail(email)
            if(!foundUser) {
                throw new BadRequestError("User not registered with this email!")
            }
            const match = bcrypt.compare(password , foundUser.user_password);
            if(!match) {
                throw new AuthFailureError("Authentication failed! Wrong password!")
            }
            
            //create token
            const publicKey = crypto.randomBytes(64).toString('hex');
            const privateKey = crypto.randomBytes(64).toString('hex');
    
            const tokens = await createKeyPair({userId: foundUser._id , email ,role: ROLE_CONSTANT.USER } , publicKey , privateKey)
    
            await keyTokenService.createKeyToken({
                refreshToken: tokens.refreshToken,
                publicKey,
                privateKey,
                userId: foundUser._id,
            })
    
            return {
                    shop : getInfoData({fields: ['_id', 'user_id','user_name' , 'user_email' ], object: foundUser}),
                    tokens,
            }
    
        }
module.exports ={
    newUser,
    checkLoginEmailTokenService,
    userHandleRefreshToken,
    userLogin
}