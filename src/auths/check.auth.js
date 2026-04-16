'use strict'

const {findById} = require('../services/apiKey.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION : 'x-access-token',
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if(!key) {
            return res.status(403).json({
                message: "Forbidden Error",
            })
        }
        //check apiKey in db
        const apiKey = await findById(key);
        if(!apiKey) {
            return res.status(403).json({
                message: "Forbidden Error",
            })
        }
        req.objKey = apiKey;
        return next();
    } catch (error) {

    }
}

const permissions = (permission) => {
    return (req, res, next) => {
        if(!req.objKey.permissions) {
            return res.status(403).json({
                message: "Permission Denied",
            })
        }

        console.log('permission:: ',req.objKey.permissions);
        const validPermission = req.objKey.permissions.includes(permission);
        if(!validPermission) {
            return res.status(403).json({
                message: "Permission Denied",
            })
        }
    }
}

module.exports = {
    apiKey,
    permissions,
}
