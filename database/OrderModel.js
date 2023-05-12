import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  products:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'products'
  }],
  payment:{},
  buyers:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'users'
  },
  status:{
    type:String,
    default:"Not Process",
    enum:["Not Process" , "Processing" , "Shipped" , "delivered" ,"Canceled"]
  }
},{timestamps:true})

export default mongoose.model('orders' ,orderSchema)