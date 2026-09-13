import mongoose from "mongoose";
import {MONGO_URI} from "#/util/variable"

mongoose.connect(MONGO_URI).then(()=>{
    console.log("DB connected ...!")
}).catch((e)=>{
    console.log("DB connection getting failture :)"+e)
})