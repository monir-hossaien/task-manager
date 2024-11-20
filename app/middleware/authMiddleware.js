import { verifyToken} from "../../app/utility/tokenUtility.js";

export const authenticateUser = async (req, res, next) => {
    let token = req.headers['token'];
    let decodeToken = await verifyToken(token);

    if (!decodeToken) {
        return res.status(401).send({status: "fail", message:"unauthorized user"});
    }else{
        let email = decodeToken.email;
        let id = decodeToken.id;
        req.headers.email = email;
        req.headers.id = id;
        next()
    }
}
