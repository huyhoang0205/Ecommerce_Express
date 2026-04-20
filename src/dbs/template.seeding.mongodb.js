const {newTemplate,getTemplate} = require('../services/template.service')

const seedingTemplate = async() => {
    const template = await getTemplate({
            temp_name: 'HTML EMAIL TOKEN'
        })
    if(!template) {
        await newTemplate({
            temp_id: 1001,
            temp_name: "HTML EMAIL TOKEN"
        })
    }
}

module.exports = {
    seedingTemplate
}