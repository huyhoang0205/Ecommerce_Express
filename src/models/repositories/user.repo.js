'use strict'

const USER = require('../user.model')

const createUser = async ({
    user_name,user_email,user_slug,user_password,user_role
})=>{
    const user = await USER.create({
        user_name,
        user_email,
        user_slug,
        user_password,
        user_role
    })

    return user
}

const findByEmail = async(email, select = {user_email: 1, user_password: 1, user_name: 1}) => {
    return await USER.findOne({user_email:email})
            .select(select)
            .lean()
}

module.exports ={
    createUser,
    findByEmail
}

