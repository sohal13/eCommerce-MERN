import userSchema from '../database/userSchema.js';
import { passHashing } from './passHashing.js';


//email send configration
/*const transPorter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"sohalr1305@gmail.com",
        pass:"wfpbutlliskpripm"
    }
})*/

 export const forgotpassHandler=async(req,res)=>{
 
    const {email ,favourit  ,newpassword ,newcpassword} = req.body;
    if(!email){
        res.status(400).send({message:"Email is requires"})
    }
    if(!favourit ){
        res.status(400).send({message:"Car name is requires"})
    }   
     if(!newpassword){
        res.status(400).send({message:"password is requires"})
    }   
     if(!newcpassword){
        res.status(400).send({message:"confirm-password is requires"})
    }
    try {
        const user = await userSchema.findOne({email,favourit})
        if(!user){
            return res.status(401).send({
                success:false,
                message:"User not Found"
            })
        }
        const hashed = await passHashing(newpassword)
        await userSchema.findByIdAndUpdate(user._id,{password:hashed,cpassword:newcpassword})
        res.status(201).send({
            success:true,
            message:"Password change successfaull"
        })
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success:false,
            message:"somthing went Wrong",
            error,
        })
    }

}

//update profile handler
 export const updateProfile=async(req,res)=>{
    try {
        const {name,email,address,phone} = req.body;

        const user = await userSchema.findById(req.user._id)
           
        const updatedUser = await userSchema.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            email:email || user.email,
            phone:phone || user.phone,
            address:address || user.address,
        },{new:true})
        res.status(200).send({
            success:true,
            message:"Profile Updated",
            updatedUser
        })


    } catch (error) {
        console.log(error);
        res.status(401).send({
            success:false,
            message:"somthing went in Updating Profile",
            error,
        })
    }
 }

