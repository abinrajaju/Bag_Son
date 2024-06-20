const mongoose=require('mongoose')


const Categoryschema= new mongoose.Schema({
    CategoryName:{
        type:String,
        required:true
    },
    list:{
        type:String,
        enum:["listed","unlisted"],
        default:"listed"
    },
    discription:{
        type:String
    }
})


const Categorydb=mongoose.model('Categorydb',Categoryschema)

module.exports=Categorydb;