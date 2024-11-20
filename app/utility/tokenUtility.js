import jwt from 'jsonwebtoken';
import {JWT_EXPIRE_TIME, JWT_KEY} from "../config/config.js";

export const createToken = (email, _id)=>{
    const secret_key = JWT_KEY;
    const payload = {email:email, id: _id};
    const options = {expiresIn: JWT_EXPIRE_TIME}
    const token  = jwt.sign(payload, secret_key, options);
    return token;
}

export const verifyToken = async (token)=>{
    try {
        const secret_key = JWT_KEY;
        const decodedToken = await jwt.verify(token, secret_key);
        return decodedToken;
    }catch (e) {
        return null;
    }
}