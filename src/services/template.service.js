'use strict'

const TEMPLATE = require('../models/template.model')
const {
    temLogin
} = require('../public/mail_template')

const newTemplate = async ({
    temp_id,
    temp_name,
    temp_html
}) => {
    if(!temp_html){
        const newTemp = await TEMPLATE.create({
            temp_id,
            temp_name,
            temp_html: temLogin()
        })
        return newTemp
    }
    const newTemp = await TEMPLATE.create({
        temp_name,
        temp_html
    })
    return newTemp
}

const getTemplate = async ({
    temp_name
}) => {
    const template = await TEMPLATE.findOne({
        temp_name
    })

    return template
}

module.exports = {
    newTemplate,
    getTemplate
}