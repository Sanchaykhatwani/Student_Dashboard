const mongoose=require("mongoose");



const studentSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    branch:String,
    email:{
        type:String,
        require:true,
        unique:true,
    },
    mobile:Number,
    city:String

});


const student=new mongoose.model("student",studentSchema);



module.exports=student;