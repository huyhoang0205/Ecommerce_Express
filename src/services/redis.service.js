'use strict'

const {
    BadRequestError,
} = require('../cores/error.response')

//repo
const {
    reservationInventory
} = require('../models/repositories/inventory.repo')

const {redisClient} = require('../dbs/init.redis')

const redis_client = redisClient


const acquireLockGtV3 = async (product_id, product_quantity, cart_id) => {
    const key = `lock_v2026_${product_id}`;
    const retry_time = 10;
    const expiredTime = 3000;//3s
    for(let i=0; i < retry_time; i++) {
        const result = await redis_client.set(key, expiredTime , {
            NX: true,
            PX: expiredTime
        })
        console.log(`results::`, result);
        if(result === 'OK') {
            const isReservation = await reservationInventory({
                product_id, product_quantity, cart_id
            })
            if(isReservation.modifiedCount){
                await releaseLockGtV3(key);
                return key
            } 
            return null;
        } else {
            await new Promise( resolve => setTimeout(resolve, 50))
        }
    }
}

const releaseLockGtV3 = async (key_lock) => {
    return await redis_client.del(key_lock);
}

module.exports = {
    acquireLockGtV3,
    releaseLockGtV3
}