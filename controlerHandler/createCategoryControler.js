import slugify from 'slugify'
import categorySchema from '../database/categoryModel.js'

//create catogry controler
export const createCategoryControler =async(req,res)=>{
    try
    {
        const {name} = req.body
        if(!name){
            return res.status(401).send({message:'Name is required'})
        }
        const existingCategory = await categorySchema.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:"Category Aleady existed"
            })
        }
        const category = await new categorySchema({name , slug:slugify(name)}).save()
        res.status(201).send({
            success:true,
            message:"new Category Created",
            category,
        })

    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error in Catogrey"
        })
    }
}

// update catogry controler
export const updateCategoryControler=async(req,res)=>{
    try {
        const {name} = req.body
        const{id} = req.params
        const category = await categorySchema.findByIdAndUpdate(id,{name , slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:"Catogry Updated Succesfull",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"error wile updating catogry"
        })
    }
}

//show alll category

export const categoryControler=async(req,res)=>{
    try {
        const categories = await categorySchema.find({})
        res.status(200).send({
            success:true,
            message:"All Categoryes shown Succesfully",
            categories,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"erroe wile getting all categories",
            error,
        })
        
    }
}


///single category

export const singlecategoryControler= async(req,res)=>{
    try {
        const category = await categorySchema.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"Succesfully showing Single category",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in showing Single category",
            error,
        })
    }
}

//delete category 
export const deleteCategory=async(req,res)=>{
    try {
        const{id} = req.params
        const category = await categorySchema.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"Succesfully Deleted Single category",
            category
        })
    
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in deleting Single category",
            error,
        })
    }
}