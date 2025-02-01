const mongoose = require('mongoose');
const { Schema } = mongoose;
const baseSchema = require('./baseClass');

const serviceSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "Operational",
        }
    }
);

serviceSchema.add(baseSchema);

const Service = mongoose.model('services', serviceSchema);

module.exports = Service;