'use strict'

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 1000 * 60 * 5; // 5 minutes
//count connection
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections: ${numConnection}`);
}

//check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memmoryUsage = process.memoryUsage().rss;

        const maxConnections = numCores * 5; // 5 connections per core

        console.log(`Active Connections: ${numConnection}`);
        console.log(`Memory Usage: ${memmoryUsage / (1024 * 1024)} MB`);

        if( numConnection > maxConnections) {
            console.log('connection overload detected');
        }    
    }, _SECONDS)
}

module.exports = {
    countConnect,
    checkOverload
}