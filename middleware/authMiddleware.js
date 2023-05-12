import JWT from 'jsonwebtoken'
import userSchema from '../database/userSchema.js';

//Middleware - protecting Routs using JWT tokens
export const impMiddleware = async(req,res,next)=>{
    
    try {
        const decode = JWT.verify(
            req.headers.authorization, 
            process.env.JWT_SECRET
            );
            req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Invalid Token",
            error
        })
    }

}

//ADMIN MIDDLEWARE PANNEL

export const isAdmin = async(req,res,next)=>{
    try {
        const admin = await userSchema.findById(req.user._id)
        if(admin.role !==1 ){
            return res.status(401).send({
                success:false,
                message:"UnAuthorized Access"
            });
        }
        else{
            next();
        }
    } catch (error) {
        res.status(401).send({
            success:false,
            message:"ADMIN tokem INVALID",
            error,
    })
  }
}