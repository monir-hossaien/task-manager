import bcrypt from "bcrypt";
import User from '../../app/models/userModel.js';
import {createToken} from "../../app/utility/tokenUtility.js";
import SendEmail from '../../app/utility/emailUtility.js';
import { OTP_EXPIRE_TIME, RANDOM_OTP } from '../../app/config/config.js';

export const Registration = async (req,res)=>{
    try {
        const reqBody = req.body;
        const newUser = await User.create(reqBody)
        res.status(201).json({
            status:"success",
            message:"user registration success",
            data:newUser
        })
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}


export const Login = async (req,res)=>{
    try {
        const {email, password} = req.body;

        //find user
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({status:"fail",message:"user not found"});
        }
        //check password
        const isValid = await bcrypt.compareSync(password, user.password );
        if(!isValid){
            return res.status(401).json({status:"fail",message:"Invalid password"});
        }
        else{
            const token = createToken(user['email'], user["_id"]);
            res.status(200).json({
                status:"success",
                message:"user login success",
                data: token
            })
        }
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}

export const ProfileDetails = async (req,res)=>{
    try {
        const user_id = req.headers.id;
        const user = await User.findOne({_id: user_id});
        res.status(200).json({
            status:"success",
            message:"read profileDetails success",
            data: user
        })
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}


export const ProfileUpdate = async (req,res)=>{
    try {
        const reqBody = req.body;
        const user_id = req.headers.id;
        const user = await User.findOne({_id:user_id});
        if(!user){
            return res.status(404).json({status:"fail",message:"user not found"});
        }
        else{
            const updateUser = await User.findOneAndUpdate({_id: user_id}, {$set: reqBody}, {new: true});
            res.status(200).json({
                status:"success",
                message:"update successfully",
                data: updateUser
            })
        }

    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}

export const EmailVerify = async (req,res)=>{
    try {
        let user_email = req.body.email;
        // find user
        let user = await User.findOne({email: user_email});
        if(!user){
            return res.status(404).json({status:"fail",message:"user not found"});
        }
        else{
            // Generate a random OTP
            const otp = RANDOM_OTP
            const expires = OTP_EXPIRE_TIME
            await User.findOneAndUpdate({"email": user_email}, {$set: {otp, otpExpiry: expires}}, {new: true});
            
            // mail details
            const subject = "Task manager verification code";
            const text = `Your 6-digit OTP for email verification is: ${otp}. It is valid for 10 minutes.`;
            //mail send
            await SendEmail(user_email, subject, text);

            res.status(200).json({
                status:"success",
                message:"6-digit OTP sent your email address",
                data: { email: user_email, otpExpiry: new Date(expires).toISOString() }
            })
        }
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}


export const OTPVerify = async (req,res)=>{
    try {
        const {email, otp} = req.body;

        // Validate input fields
        if (!email || !otp) {
            return res.status(400).json({status: "fail", message: "Email and OTP are required."});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({status:"fail",message:"user not found"});
        }

        // Check OTP and expiry
        if(user.otp !== otp){
            return res.status(401).json({status:"fail", message:"Invalid OTP"})
        }
        if(user.otpExpiry < Date.now()){
            return res.status(401).json({status:"fail", message:"OTP has expired."})
        }
        else{
            res.status(200).json({
                status:"success",
                message:"OTP verification success",
            })
        }

    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}

export const ResetPassword = async (req,res)=>{
    try {
        const {email, otp, password} = req.body;
        const user = await User.findOne({email, otp});
        if(!user){
            return res.status(404).json({status:"fail", message:"user not found"});
        }
        else{
            const result = await User.findOneAndUpdate({email, otp}, {$set:{password, otp: 0}}, {new: true});
            res.status(200).json({
                status:"success",
                message:"password reset successfully",
                data: result
            })

        }
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}

