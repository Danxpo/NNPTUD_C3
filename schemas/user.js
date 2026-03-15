let mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username khong duoc trung"],
        required: [true, "username khong duoc rong"]
    },
    password: {
        type: String,
        required: [true, "password khong duoc rong"]
    },
    email: {
        type: String,
        unique: [true, "email khong duoc trung"],
        required: [true, "email khong duoc rong"]
    },
    fullName: {
        type: String,
        default: ""
    },
    avatarUrl: {
        type: String,
        default: "https://i.sstatic.net/l60Hf.png"
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'role',
        required: false // making role optional or required based on use case, standard is required but i'll stick to not failing if not provided unless needed, actually required is better
    },
    loginCount: {
        type: Number,
        default: 0,
        min: [0, "loginCount khong duoc nho hon 0"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
module.exports = new mongoose.model('user', userSchema);
