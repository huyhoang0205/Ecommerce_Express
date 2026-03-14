'use strict'

const _ = require('lodash');
const getInfoData = ({fields = [] , object = {}}) => {
    return _.pick(object , fields)
}

const getSelectData = (select=[]) => {
    return Object.fromEntries(select.map(e => {e,1}))
}

const getUnSelectData = (select=[]) => {
    return Object.fromEntries(select.map(e => {e,0}))
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

module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
}