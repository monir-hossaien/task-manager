
import User from '../../app/models/userModel.js';
import {createToken} from "../../app/utility/tokenUtility.js";
import SendEmail from '../../app/utility/emailUtility.js';

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
        const reqBody = req.body;
        const user = await User.findOne(reqBody);
        if(!user){
            return res.status(404).json({status:"fail",message:"user not found"});
        }else{
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
            // Generate a 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000);
            const expire = Date.now() + 10 * 60 * 1000;
            const result = await User.findOneAndUpdate({"email": user_email}, {$set: {otp, expire}}, {new: true});
            
            // mail details
            const subject = "Verify your email";
            const text = `Your 6-digit OTP for email verification is: ${otp}. It is valid for 10 minutes.`;
            //mail send
            await SendEmail(user_email, subject, text);

            res.status(200).json({
                status:"success",
                message:"6-digit OTP sent your email address",
                data:result
            })
        }
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}


export const OTPVerify =  (req,res)=>{
    try {
        const reqBody = req.body;
        
        res.status(200).json({
            status:"success",
            message:"user OTPVerify success",
        })
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}

export const ResetPassword =  (req,res)=>{
    try {
        res.status(200).json({
            status:"success",
            message:"user ResetPassword success",
        })
    }catch (e) {
        return res.json({status:"fail","Message":e.toString()})
    }
}

