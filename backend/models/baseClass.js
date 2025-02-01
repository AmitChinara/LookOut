const mongoose = require('mongoose');
const { Schema } = mongoose;

const baseSchema = new Schema(
    {
        createdBy: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedBy: {
            type: String,
            default: null,
        },
        updatedAt: {
            type: Date,
            default: null,
        },
        extras: {
            type: String,
        }
    },
    {
        timestamps: true,  // Mongoose handles 'createdAt' and 'updatedAt' automatically
    }
);

module.exports = baseSchema;