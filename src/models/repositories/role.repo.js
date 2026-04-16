'use strict'

const ROLE = require('../role.model')

const getRoleIdByName = async(role_name) => {
    const role_id = await ROLE.findOne({role_name}).lean()
    return role_id._id
}

module.exports = {
    getRoleIdByName
}