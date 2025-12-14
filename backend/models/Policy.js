const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    policyType: {
        type: String,
        enum: ['leave', 'conduct', 'security', 'health', 'other'],
        default: 'other',
    },
    fileUrl: {
        type: String,
        required: true,
    },
    fileName: String,
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Policy', policySchema);
