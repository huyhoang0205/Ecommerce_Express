'use strict'

const { SuccessResponse } = require("../cores/success.response")

const fakeData = [
    {
        user_id: 1,
        user_name: 'cr7',
        user_avatar: 'image.com/user/1'
    },
    {
        user_id: 2,
        user_name: 'm10',
        user_avatar: 'image.com/user/2'
    },
    {
        user_id: 3,
        user_name: 'user',
        user_avatar: 'image.com/user/3'
    },
]

class ProfileController {
    profiles = async (req, res, next) => {
        new SuccessResponse({
            message:'View ALL Profile',
            metadata: fakeData
        }).send(res)
    }

    profile = async (req, res, next) => {
        new SuccessResponse({
            message:'View ALL Profile',
            metadata: fakeData[1]
        }).send(res)
    }
}

module.exports = new ProfileController();