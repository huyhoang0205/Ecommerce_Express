'use strict'

const {
    SuccessResponse
} = require('../cores/success.response')
const {
    pushNotiToSystem,
    listNotiByUser
} = require('../services/notification.service');

class NotificationController {

    listNotiByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add Stock Into Inventory Successfully!',
            metadata: await listNotiByUser(req.body)
        })
    }
}

module.exports = new NotificationController()