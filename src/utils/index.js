'use strict'

const _ = require('lodash');
const {Types} = require('mongoose')
const getInfoData = ({fields = [] , object = {}}) => {
    return _.pick(object , fields)
}

const getSelectData = (select=[]) => {
    const rs = Object.fromEntries(select.map(e => [e,1]))
    return rs;
}

const getUnSelectData = (select=[]) => {
    return Object.fromEntries(select.map(e => [e,0]))
}

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach( k => {
        if(obj[k] === null){
            delete obj[k];
        }
    })

    return obj;
} 

const updateNestedObjectParser = obj => {
    const final = {};
    Object.keys(obj).forEach( k => {
        if(obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const res = updateNestedObjectParser(obj[k])
            Object.keys(res).forEach(e => {
                final[`${k}.${e}`] = res[e];
            })
        }else {
            if(obj[k]) final[k] = obj[k];
        }
    })

    return final;
}

const convertToObjectIdMongoDb = id => new Types.ObjectId(id);


const replacePlaceholder = (template, params) => {
    console.log("Params in replacePlaceHolder:::",params);
    Object.keys(params).forEach( k => {
        const placehoder = `{{${k}}}`
        template = template.replace(new RegExp(placehoder, 'g'), params[k])
    })

    return template;
}

module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongoDb,
    replacePlaceholder
}