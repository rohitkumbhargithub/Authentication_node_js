const mongoose = require('mongoose');

const empSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        designation: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        file: {
            type: String,
            required: true,
        }
    },{
        timestamps: true,
    }
)


const Emp = mongoose.model("Emp", empSchema);

module.exports = Emp;