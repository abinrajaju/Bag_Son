const categorydb= require('../../model/category')
const productdb= require('../../model/product')
const offerdb=require('../../model/offermodel')


const applyoffer = async (product) => {
    if (!product) {
        return null;
    }

    try {
        const productOffer = await offerdb.findOne({
            product_name: product._id,
            status: 'active'
        });
       

        const categoryOffer = await offerdb.findOne({
            category_name: product.Category._id, // Ensure this matches the field used in product's schema
            status: 'active'
        });

        if (productOffer && typeof productOffer.discount_Percentage === 'number') {
            product.offerPrice = Math.round(product.price - (product.price * (productOffer.discount_Percentage / 100)));
            console.log("Applied product offer");
        } else if (categoryOffer && typeof categoryOffer.discount_Percentage === 'number') {
            product.offerPrice = Math.round(product.price - (product.price * (categoryOffer.discount_Percentage / 100)));
            console.log("Applied category offer");
        } else {
            product.offerPrice = product.price;
            console.log("No offers applied");
        }
    } catch (error) {
        console.error('Error applying offer:', error);
    }

    return product;
    
};




const men= async(req,res)=>{
    try{
    const mencategory=await categorydb.findOne({CategoryName:'men'});

    const menproduct=await productdb.find({Category:mencategory._id}).populate('Category')
    for (const product of menproduct) {
        await applyoffer(product);
    }
   
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
        for (const product of products) {
            await applyoffer(product);
        }
        
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



const sort_product=async(req,res)=>{
    try {
        const userEmail = req.session.email
        const { sortBySelect } = req.body;
        console.log(sortBySelect);
    } catch (error) {
        console.log(error);
    }
}



module.exports={
    men,kid,women,allproduct,shopeCata,sort_product
}