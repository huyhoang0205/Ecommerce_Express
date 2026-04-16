'use strict'

const dev = {
    app: {
        host: process.env.DEV_APP_HOST || 'localhost',
        port: process.env.DEV_APP_PORT || 3056,
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'shopDEV'
    },
    email: {
        user: process.env.EMAIL_USER || 'nguyendinhhuyhoang8a@gmail.com',
        password: process.env.EMAIL_PASS
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
    }
}

const prod = {
    app: {
        host: process.env.DEV_APP_HOST || 'localhost',
        port: process.env.PROD_APP_PORT || 3052,
    },
    db: {
        host: process.env.PROD_DB_HOST || 'localhost',
        port: process.env.PROD_DB_PORT || 27017,
        name: process.env.PROD_DB_NAME || 'shopPROD'
    },
    email: {
        user: process.env.EMAIL_USER || 'nguyendinhhuyhoang8a@gmail.com',
        password: process.env.EMAIL_PASS
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
    }
}

const config = { dev, prod }
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];