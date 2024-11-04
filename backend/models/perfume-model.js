import mongoose from "mongoose";
const Schema = mongoose.Schema;
const perfumeSchema = new Schema({
    code:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    
    description:{
        type:String,
        required:true
    },
    image: {
        type: String,
        required: true
    }
});
const Perfume = mongoose.model('Perfume', perfumeSchema);

export default Perfume;