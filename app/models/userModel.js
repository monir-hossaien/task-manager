import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            default: 0,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const User = mongoose.model('user', UserSchema);

export default User;