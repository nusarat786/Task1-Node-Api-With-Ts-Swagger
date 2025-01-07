import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dbConnect from './Db/mogoConnect'
import userRoutes from './Routes/userRoutes';
import swaggerDocs from '../swagger'

const port = 4000;
const app = express();
dbConnect();
swaggerDocs(app,port);

console.log("hello")
app.use(express.json())

app.use(cookieParser())

app.use(bodyParser.json())


app.get("/",(req,res)=>{
    res.send("Home")
})

app.use(userRoutes)


app.listen(port,()=>{
    console.log(`app is started on http://localhost:${port}/`)
})