
import bcrypt from "bcrypt";
import {saltRounds} from "../../app/config/config.js"
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, 'name must be required'],
        },
        email: {
            type: String,
            required: [true, 'email must be required'],
            unique: true,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email regex
                },
                message: (props) => `${props.value} is not a valid email address!`,
            }
        },
        phone: {
            type: String,
            required: [true, 'phone must be required'],
            unique: true
        },
        password: {
            type: String,
            required: true,
            unique: true,
            set: (v)=>bcrypt.hashSync(v, bcrypt.genSaltSync(saltRounds)), // Hashing password before saving
        },
        otp: {
            type: Number,
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