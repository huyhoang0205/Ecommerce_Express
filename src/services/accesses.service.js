'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const keyTokenService = require('./keyToken.service')
const { createKeyPair,
        verifyJWT,
 } = require('../auths/auth.Util')
const { getInfoData } = require('../utils')
const { BadRequestError , 
        AuthFailureError,
        ForbiddenError,
} = require('../cores/error.response')

const ROLE_SHOP = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
}

//service
const {findByEmail} = require('./shop.service')

class AccessesService {

    static  handleRefreshToken = async ({refreshToken , user ,keyStore}) => {

        const {userId , email} = user;

        if(keyStore.refreshTokensUsed.includes(refreshToken)) {
            await keyTokenService.deleteKeyById({userId})
            throw new ForbiddenError("Refresh token reuse detected! Pls re-login!")
        }

        if(keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError("Shop not found with this refresh token!")
        }

        const foundShop = await findByEmail(email);

        console.log('[2]:::' , {userId , email})

        if(!foundShop) {
            throw new AuthFailureError("Shop not found with this refresh token!")
        }

        //create new accessToken and refreshToken
        const tokens = await createKeyPair({userId , email}, keyStore.publicKey , keyStore.privateKey)

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

    static logout = async (keyStore) => {
        const delKey = await keyTokenService.removeKeyById(keyStore._id);
        console.log("Delete KeyStore:: ", delKey);
        return delKey
    }

    static login = async ( {email , password , refreshToken = null}) => {
        const foundShop = await findByEmail(email)
        if(!foundShop) {
            throw new BadRequestError("Shop not registered with this email!")
        }

        const match = bcrypt.compare(password , foundShop.password);
        if(!match) {
            throw new AuthFailureError("Authentication failed! Wrong password!")
        }
        
        //create token
        const publicKey = crypto.randomBytes(64).toString('hex');
        const privateKey = crypto.randomBytes(64).toString('hex');

        const tokens = await createKeyPair({userId: foundShop._id , email } , publicKey , privateKey)

        await keyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            publicKey,
            privateKey,
            userId: foundShop._id,
        })

        return {
                shop : getInfoData({fields: ['_id', 'name' , 'email' ], object: foundShop}),
                tokens,
        }

    }

    static signup = async ({name , email ,password}) => {
            //check mail exist
            const holderShop = await shopModel.findOne({email}).lean();
            if(holderShop) {
                throw new BadRequestError("Error: Shop already registered with this email!");
            }

            const passwordHash = await bcrypt.hash(password,10);

            const newShop = await shopModel.create({
                name , email , password: passwordHash , roles: [ROLE_SHOP.SHOP]
            })
            if(newShop) {
                //create privateKey and publicKey with RSA
                // const {privateKey , publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs8',
                //         format: 'pem',
                //     }
                // });
                //  console.log(privateKey , publicKey) 
                const publicKey = crypto.randomBytes(64).toString('hex');
                const privateKey = crypto.randomBytes(64).toString('hex');
                // store publicKey to collection KeyToken in MongoDB
                const keyStore = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })
                console.log("keyStore:: ", keyStore);
                if(!keyStore) {
                    return {
                        code : "xxxx",
                        message : "keyToken Store error!",
                    }
                }
                // JWT
                const tokens = await createKeyPair({userId: newShop._id , email } , keyStore.publicKey , keyStore.privateKey)
                console.log("Created Token Successfully:: ", tokens);
                
                return {
                    code : 201,
                    metadata : {
                        shop : getInfoData({fields: ['_id', 'name' , 'email' ], object: newShop}),
                        tokens
                    }
                }
            }
            return {
                code : 201,
                metadata : null
            }
        }
}

module.exports = AccessesService;