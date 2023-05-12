import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan'
import ConnectionDB from './database/db.js';
import authRouter from './authorization/authRouter.js'
import cors from 'cors'
import CategoryRouter from './authorization/categoryRout.js';
import productRout from './authorization/productRout.js';


//config env - user fro security purpse
dotenv.config();

//connection to the DataBase
ConnectionDB();

//config rest 
const app = express();

//Middle-ware - use fro hashing converting json file to strings
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//Routers for getting and posting Data to server
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/category', CategoryRouter)
app.use('/api/v1/product', productRout)

//rest API
app.get('/', (req, res) => {
    res.send('<h1>Welcome to My E-Commerce WebSite</h1>')
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log("Server Working at ?-?-");
})