const categorydb= require('../../model/category')
const productdb= require('../../model/product')





const men= async(req,res)=>{
    try{
    const mencategory=await categorydb.findOne({CategoryName:'men'});

    const menproduct=await productdb.find({Category:mencategory._id}).populate('Category')
   
    res.render('user/products',{products:menproduct,mencategory})
    
    }catch(err){
        console.error(err);
       res.redirect('/err500')
    }
}


const women= async(req,res)=>{
    try{
    const mencategory=await categorydb.findOne({CategoryName:'women'});
   
    const menproduct=await productdb.find({Category:mencategory._id}).populate('Category')
      console.log(menproduct);
    res.render('user/products',{products:menproduct,mencategory})
    
    }catch(err){
        console.error(err);
       res.redirect('/err500')
    }
}


const kid= async(req,res)=>{
    try{
    const mencategory=await categorydb.findOne({CategoryName:'kid'});
  
    const menproduct=await productdb.find({Category:mencategory._id}).populate('Category')
      console.log(menproduct);
    res.render('user/products',{products:menproduct,mencategory})
    
    }catch(err){
        console.error(err);
       res.redirect('/err500')
    }
}


const allproduct=async(req,res)=>{
    try{
        const products = await productdb.find().populate("Category")
        
            res.render('user/products',{products,mencategory:""})
    }catch(err){
        console.log(err);
        res.redirect('/error500')
    }
}


const shopeCata=async(req,res)=>{
   try{
    const category=req.body.tems
    console.log(category);
        res.json(category)
        
   
   }catch(err){
    console.log(err);
   }
}




module.exports={
    men,kid,women,allproduct,shopeCata
}