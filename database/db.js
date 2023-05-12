import mongoose from "mongoose";

const ConnectionDB = async()=>{
    try {
        const connected =await mongoose.connect(process.env.MONGODB)
        console.log("Connected To The Server");
    } 

    catch (error) {
        console.log(error);

    }
}

export default ConnectionDB;