'use strict'

const mongoose = require('mongoose');
const { db: {host, port, name} } = require('../configs');
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        if(1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }
        
        mongoose.connect( connectString).then( _ => console.log('Connected to MongoDB successfully!'))
        .catch( err => console.log('Failed to connect to MongoDB: ' + err));
    }

    static getInstance() {
        if(!Database.instance){
            Database.instance = new Database();
        }

        return Database.instance; 
    }
}

const databaseInstance = Database.getInstance();

module.exports = databaseInstance;