const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'hr', 'employee'],
        default: 'employee',
    },
    department: String,
    position: String,
    salary: {
        baseSalary: {
            type: Number,
            default: 0,
        },
        fixedSalary: {
            type: Number,
            default: 0,
        },
        variableSalary: {
            type: Number,
            default: 0,
        },
    },
    performance: {
        teamPerformance: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        individualPerformance: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        companyPerformance: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    },
    profileImage: String,
    joinDate: {
        type: Date,
        default: Date.now,
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

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
