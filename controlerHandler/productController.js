import slugify from 'slugify'
import dotenv from 'dotenv';
import productSchema from '../database/productSchema.js'
import fs from 'fs'
import braintree from 'braintree'
import orderSchema from '../database/OrderModel.js'



dotenv.config();
//paymentgat way

var gateway = new braintree.BraintreeGateway ({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MECHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

///creeate products
export const createproductController = async (req, res) => {
    try {
        const { name, description, price, category, qunatity, shipping } = req.fields
        const { photo } = req.files
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" })
            case !description:
                return res.status(500).send({ error: "Description is Required" })
            case !price:
                return res.status(500).send({ error: "Price is Required" })
            case !category:
                return res.status(500).send({ error: "Category is Required" })
            case !qunatity:
                return res.status(500).send({ error: "Qunatity is Required" })
            case !photo && photo.size > 1000000:
                return res.status(500).send({ error: "photo is Required and should be less than 1mb" })
        }

        const products = new productSchema({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: 'product created succesfull',
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in creating products handler",
            error
        })
    }
}

//get all products
export const getproductController = async (req, res) => {
    try {
        const product = await productSchema.find({})
            .populate('category')
            .select('-photo')
            .limit(12)
            .sort({ createdAt: -1 })

        res.status(200).send({
            success: true,
            totalproducts: product.length,
            message: " getting products ",
            product,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in getting products handler",
            error
        })
    }
}

///gt single products
export const getSingleProducts = async (req, res) => {
    try {
        const products = await productSchema.findOne({ slug: req.params.slug })
            .populate('category').select('-photo')
        res.status(200).send({
            success: true,
            message: "getting single products ",
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in getting single products ",
            error
        })
    }
}


//get photos
export const productphotoController = async (req, res) => {
    try {
        const product = await productSchema.findById(req.params.pid)
            .select('photo')
        if (product.photo.data) {
            res.set('content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in getting single photo",
            error
        })
    }
}

//delete products
export const deleteproductController = async (req, res) => {
    try {
        const product = await productSchema.findByIdAndDelete(req.params.pid).select('-photo')
        res.status(200).send({
            success: true,
            message: " products deleted succesfully ",
            product,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in deleting products",
            error
        })
    }
}

//update product
export const updateproductController = async (req, res) => {
    try {
        const { name, description, price, category, qunatity, shipping } = req.fields
        const { photo } = req.files
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" })
            case !description:
                return res.status(500).send({ error: "Description is Required" })
            case !price:
                return res.status(500).send({ error: "Price is Required" })
            case !category:
                return res.status(500).send({ error: "Category is Required" })
            case !qunatity:
                return res.status(500).send({ error: "Qunatity is Required" })
        }

        const products = await productSchema.findByIdAndUpdate(req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );

        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()

        res.status(201).send({
            success: true,
            message: 'product updated succesfull',
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in updating products",
            error
        })
    }
}

//use to filter prouct
export const productfilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let arg = {}
        if (checked.length > 0) arg.category = checked
        if (radio.length) arg.price = { $gte: radio[0], $lte: radio[1] }

        const products = await productSchema.find(arg)
        res.status(201).send({
            success: true,
            message: 'product filtered succesfull',
            products,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in Filtring products",
            error
        })
    }
}
//product count handler
export const productCountController = async (req, res) => {
    try {
        const total = await productSchema.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error in counting products",
            error
        })
    }
}
//product list base on page
export const productlistController = async (req, res) => {
    try {
        const perpage = 4
        const page = req.params.page ? req.params.page : 1
        const product = await productSchema.find({})
            .select('-photo')
            .skip((page - 1) * perpage)
            .limit(perpage)
            .sort({ createdAt: -1 })

        res.status(200).send({
            success: true,
            product,
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error in listing page products",
            error
        })
    }
}

//search all product
export const searchProductController = async (req, res) => {
    try {
        const {keyword} = req.params
        const result = await productSchema.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        }).select("-photo");
        res.json(result)

    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error in searching products",
            error
        })
    }
}

//api fro showing related product
export const relatedProductController=async(req,res)=>{
    try {
         const {pid , cid} = req.params;
         const products = await productSchema.find({
            category:cid,
            _id:{$ne:pid}
         }).select('-photo').limit(3).populate('category');
         res.status(200).send({
            success:true,
            products,  
         })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error in getting related products",
            error
        })
    }
}

//braintreee
//token
export const braintreetokenController=async(req,res)=>{
try {
    gateway.clientToken.generate({} ,function(error,response){
        if(error){
            res.status(500).send(error)
        }else{
            res.send(response)
        }
    })
} catch (error) {
    console.log(error);
}
}

//payment getway
export const  paymentController=async(req,res)=>{
try {
    const{cart , nonce} = req.body;
    let total = 0;
    cart.map((i) =>{
        total += i.price;
    });
    let newtransection = gateway.transaction.sale({
        amount:total,
        paymentMethodNonce: nonce,
        options:{
            submitForSettlement:true
        }
    },
    function(error,result){
        if (result) {
            const order = new orderSchema({
                products:cart,
                payment: result,
                buyers:  req.userFound._id
            }).save()
            res.json({ok:true,message:"Working good"})
        }else{
            res.status(500).send(error)
        }
    }
    )
} catch (error) {
    console.log(error);
}
}