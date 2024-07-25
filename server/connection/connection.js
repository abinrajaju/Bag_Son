const mongoose=require('mongoose')

const connectDB=async()=>{
    try{
        const con = await mongoose.connect("mongodb+srv://abinraj1090:2Qdu4OJ1d2tcf9TC@bagson.qz3wdam.mongodb.net/bagson?retryWrites=true&w=majority&appName=BAGSON",{})
      console.log(`MongoDB connected: ${con.connection.host}`);
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}
module.exports=connectDB