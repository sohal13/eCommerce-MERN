import express from 'express'
import { impMiddleware, isAdmin } from '../middleware/authMiddleware.js';
import { braintreetokenController, createproductController, deleteproductController, getSingleProducts, getproductController, paymentController, productCountController, productfilterController, productlistController, productphotoController, relatedProductController, searchProductController, updateproductController } from '../controlerHandler/productController.js';
//packege use for photo uploding
import formidable from 'express-formidable'

const productRout = express.Router();


//routs
//create products
productRout.post('/create-product',
impMiddleware,
isAdmin,
formidable(),
createproductController
)

//get products
productRout.get('/get-product',getproductController)

//get single products
productRout.get('/get-product/:slug',getSingleProducts)

//get photo
productRout.get('/product-photo/:pid' ,productphotoController)

//delete product
productRout.delete('/delete-product/:pid' ,impMiddleware,isAdmin,deleteproductController)

//update products
productRout.put('/update-product/:pid',
impMiddleware,
isAdmin,
formidable(),
updateproductController
)

//filter product
productRout.post('/product-filter' , productfilterController)

//product count
productRout.get('/product-count' ,productCountController)

//product count
productRout.get('/product-list/:page' ,productlistController)

//serach product
productRout.get('/search/:keyword' , searchProductController)

//similier product
productRout.get('/realted-product/:pid/:cid' , relatedProductController)

//payment gatway
//token
productRout.get('/braintree/token' , braintreetokenController)

//payment
productRout.post('/braintree/payment' , impMiddleware , paymentController)

export default productRout;