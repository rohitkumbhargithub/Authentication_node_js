const mongoose = require('mongoose');

const connectToDb = async () => {
    try{
        await mongoose.connect('mongodb://localhost:27018/final_project');
        console.log('connected to MongoDB');
    }catch(err){
        console.error(err.message);
    }
}

module.exports = connectToDb;