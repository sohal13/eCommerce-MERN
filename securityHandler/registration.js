import userSchema from "../database/userSchema.js"
import {passHashing} from './passHashing.js'
//registration apge api

const registerHandler = async(req,res)=>{
   try {
    const{name,phone,email,password,cpassword,favourit} = req.body
    //Validation for registration
    if(!name){
        return ({message:"Name is required"})
    }
    if(!phone){
        return ({message:"phone Number is required"})
    } 
    if(!email){
        return ({message:"email is required"})
    }
     if(!password){
        return ({message:"password is required"})
    } 
    if(!cpassword){
        return ({message:"confirm-password is required"})
    }
    if(!favourit){
        return ({message:"confirm-password is required"})
    }
    //Check if the user is present
    const exuser = await userSchema.findOne({email})
    if(exuser){
        res.status(200).send({
            success:true,
            message:"Alrady Registerde Please Login!!"
        })
    }

    // midleWare - hashing password
    //for securing password
    const hashedPassword = await passHashing(password)

    //sending user register data to scherma
    if(password===cpassword){
        const user = await new userSchema({
            name,
            phone,
            email,
            password:hashedPassword,
            cpassword,
            favourit
        }).save()
        res.status(201).send({
            success:true,
            message:"Register Successfull!!",
            user,
        })
    }
    else{
        res.status(500).send({
            success:false,
            message:"password are not maching"
        })
    }
   
} catch (error) {
    res.status(500).send({
        success:false,
        message:"Registration unSuccessFull",
        error,
    })
   }
    
}

export default registerHandler;