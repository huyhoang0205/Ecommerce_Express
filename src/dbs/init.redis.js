'use strict'

const redis = require('redis')
const {RedisError} = require('../cores/error.response')
const {redis:{host,port}} = require('../configs')
const {statusConnectRedis} = require('../constant/redis.constant')
let connectionTimeout

const REDIS_CONNECT_TIMEOUT = 10000, REDISCONNECT_MESSAGE = {
    code: -90,
    message: "service connection error"
}

const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {

        throw new RedisError({
            message: REDISCONNECT_MESSAGE.message,
            statusCode:  REDISCONNECT_MESSAGE.code
        })
    },REDIS_CONNECT_TIMEOUT)
}



const redisClient = redis.createClient({
    url: `redis://${host}:${port}`
})

redisClient.on(statusConnectRedis.CONNECT, () => {
        console.log('connection Redis - connect status: connected')
        clearTimeout(connectionTimeout)
})

redisClient.on(statusConnectRedis.END, () => {
    console.log('connection Redis - connect status: disconnect')
    handleTimeoutError()
})

redisClient.on(statusConnectRedis.RECONNECT, () => {
    console.log('connection Redis - connect status: reconnecting')
    clearTimeout(connectionTimeout)
})

redisClient.on(statusConnectRedis.ERROR, (err) => {
    console.log(`connection Redis - connect status: error - ${err}`)
    handleTimeoutError()
})

const connectRedis = async () => {

    try {
        await redisClient.connect()
    } catch (err) {
        console.error("❌ Redis connect failed:", err);
    }
}


module.exports = {
    connectRedis,
    redisClient
}