import express from 'express'
import { impMiddleware, isAdmin } from '../middleware/authMiddleware.js'
import { categoryControler, createCategoryControler, deleteCategory, singlecategoryControler, updateCategoryControler } from '../controlerHandler/createCategoryControler.js'

const CategoryRouter = express.Router()

//routs
//cretae category
CategoryRouter.post('/create-category' ,impMiddleware,isAdmin , createCategoryControler)


//update category
CategoryRouter.put('/update-category/:id' , impMiddleware , isAdmin , updateCategoryControler)


//getAll category
CategoryRouter.get('/get-category' , categoryControler)

//Single Categoryes
CategoryRouter.get('/single-category/:slug' , singlecategoryControler)

//Delete Category
CategoryRouter.delete('/delete-category/:id' ,impMiddleware , isAdmin , deleteCategory)

export default CategoryRouter