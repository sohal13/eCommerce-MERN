import JWT from 'jsonwebtoken';
import userSchema from '../database/userSchema.js';
import {convPassNormal} from './passHashing.js'

//login API
const loginHandler =async(req,res)=>{
    try {
        const {email ,password} = req.body
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid Email or Pasword"
            })
        }

        //check if the user is present
        const userFound = await userSchema.findOne({email})
        if(!userFound){
           return res.status(404).send({
                success:false,
                message:"email Not Found Please Register First"})
        }
        //converting hashing password to normal password
        const compare = await convPassNormal(password,userFound.password)
        if(!compare){
           return res.status(200).send({
                success:false,
                message:'Invalid Password'
            })
        }

        //creating JWT tooken or cockies
        const tooken = await JWT.sign({_id:userFound._id} 
            ,process.env.JWT_SECRET,
            { expiresIn:"14d"}
            )

            //sending tooken to the database
            const setuserToken = await userSchema.findByIdAndUpdate({_id:userFound._id},{tooken:tooken})
       
            res.status(200).send({
            success:true,
            message:'Login Succesfull',
            userFound:{
                name:userFound.name,
                id:userFound._id,
                email:userFound.email,
                phone:userFound.phone,
                role:userFound.role,
                address:userFound.address
            },
            tooken,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in login',
            error
        })
    }
}

export default loginHandler;