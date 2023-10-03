const mongoose = require('mongoose');

const db = mongoose.connection;

main().catch(err => console.log(err));

async function main(err){
    if(err){
        console.log("ERROR");
    }
    await mongoose.connect('mongodb://127.0.0.1:27017/auth');
    console.log('MongoDB :: database is connected!');
}

module.exports = db;