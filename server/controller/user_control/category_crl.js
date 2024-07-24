const categorydb= require('../../model/category')
const productdb= require('../../model/product')
const offerdb=require('../../model/offermodel')
const cartdb=require('../../model/cartmodel')
const wishlistdb=require('../../model/wishlistmodel')
const userdb=require('../../model/usermodel')

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
        const Category=await categorydb.findOne({CategoryName:'men'});
        const category=await categorydb.find();
        const products=await productdb.find({Category:Category._id,}).populate('Category')
        for (const product of products) {
            await applyoffer(product);
        }
        res.render('user/products',{products,category,pages:0,wishCount:0,cartCount:0})
    
    }catch(err){
        console.error(err);
       res.redirect('/err500')
    }
}


const women= async(req,res)=>{
    try{
    const Category=await categorydb.findOne({CategoryName:'women'});
    const category=await categorydb.find();
    const products=await productdb.find({Category:Category._id,}).populate('Category')
    for (const product of products) {
        await applyoffer(product);
    }
    
    res.render('user/products',{products,category,pages:0,wishCount:0,cartCount:0})
    
    }catch(err){
        console.error(err);
       res.redirect('/err500')
    }
}


const kid= async(req,res)=>{
    try{
    const Category=await categorydb.findOne({CategoryName:'kid'});
    const category=await categorydb.find();
    const products=await productdb.find({Category:Category._id,}).populate('Category')
    for (const product of products) {
        await applyoffer(product);
    }
    
    res.render('user/products',{products,category,pages:0,wishCount:0,cartCount:0,cartCount:0})
    
    }catch(err){
        console.error(err);
       res.redirect('/err500')
    }
}


const allproduct=async(req,res)=>{
    try{

      
        
        
        let cartCount = 0;
        const products = await productdb.find({list:'listed'}).populate("Category").limit(8).sort({_id : -1 });
        const category=await categorydb.find(); 
        let pages = await productdb.countDocuments();
    pages = Math.ceil(pages/8)
      if(req.cookies.userToken){
        const user= await userdb.findOne({email: req.session.email})
        const cart = await cartdb.findOne({ user: user._id });
            cartCount = cart ? cart.items.length : 0;
          const  wishlist = await wishlistdb.findOne({ user: user._id });
           let wishCount = wishlist ? wishlist.items.length: 0;
       
        for (const product of products) {
            await applyoffer(product);
        }
        
            res.render('user/products',{products,wishCount,cartCount,category,pages})
      }else{
        res.render('user/products',{products,wishCount:0,cartCount:0,category,pages})
      }
        
    }catch(err){
        console.log(err);
        res.redirect('/error500')
    }
}



const shopeCata=async(req,res)=>{
    try{
     const categoryId=req.body.items
     const category = await categorydb.findById(categoryId)
     let pages = await productdb.countDocuments({ Category: category.id});
     pages = Math.ceil(pages/8)
     const products = await productdb.find({ Category: category,list:'listed' }).populate('Category').limit(8).sort({_id : -1 });
     for (const product of products) {
        await applyoffer(product);
    }
      res.status(200).json({products,pages})
        
         
    
    }catch(err){
     console.log(err);
     res.redirect('/error500')
    }
 }
 



 const sort_product=async(req,res)=>{
    try {
       
        let sortedProducts=await productdb.find()
        const sortBySelect = req.body.selsect;
        const categoryId=req.body.selectedItemId
        const category = await categorydb.findById(categoryId)
        let pages = await productdb.countDocuments({Category: category.id});
           pages = Math.ceil(pages/8)

           for (const sortedProduct of sortedProducts) {
            await applyoffer(sortedProduct);
        }
         
        switch(sortBySelect){
            case '1':next = await productdb.find({ Category: category.id,list:'listed' }).limit(8).skip(jump).populate("Category");
                break;
            case '2': 
                    sortedProducts = await productdb.find({ Category: category.id,list:'listed' }).sort({ price: 1,offerPrice:-1,discount:-1 }).limit(8).populate("Category");
                  
                break;
            case '3':
                    sortedProducts = await productdb.find({ Category: category.id,list:'listed' }).sort({ price: -1,offerPrice:-1,discount:-1 }).limit(8).populate("Category");
                break;
            case '4':
                    sortedProducts = await productdb.find({ Category: category.id,list:'listed' }).sort({ product_name: 1 }).limit(8).populate("Category");
                    break;
            case '5':
                    sortedProducts = await productdb.find({ Category: category.id,list:'listed' }).sort({ product_name: -1 }).limit(8).populate("Category");
                break;    
            case '6':
                sortedProducts = await productdb.find({ Category: category.id,list:'listed' }).sort({ _id: -1 }).limit(8).populate("Category");
                break;
            default:
                sortedProducts = await productdb.find({ Category: category.id, list:'listed'}).limit(8).populate("Category");
        }
        
        
        res.json({sortedProducts,pages})
        res.status(200)
    } catch (error) {
        console.log(error);
        res.redirect('/error500')
    }
}


const Catasort=async(req,res)=>{
try {             

       
        const sortBySelect = req.body.selsect;
         let sortedProducts= await productdb.find()
        for (const sortedProduct of sortedProducts) {
            await applyoffer(sortedProduct);
        }
        let pages = await productdb.countDocuments();
        pages = Math.ceil(pages/8)

            switch(sortBySelect){
                case '1':next = await productdb.find({list:'listed' }).limit(8).skip(jump).populate("Category");
                    break;
                case '2': 
                        sortedProducts = await productdb.find({ list:'listed' }).sort({ price: 1,offerPrice:1,discount:1 }).limit(8)
                      
                    break;
                case '3':
                        sortedProducts = await productdb.find({ list:'listed' }).sort({ price: -1,offerPrice:-1,discount:-1 }).limit(8)
                    break;
                case '4':
                        sortedProducts = await productdb.find({ list:'listed' }).sort({ product_name: 1 }).limit(8)
                        break;
                case '5':
                        sortedProducts = await productdb.find({ list:'listed' }).sort({ product_name: -1 }).limit(8)
                    break;    
                case '6':
                    sortedProducts = await productdb.find({ list:'listed' }).sort({ _id: -1 }).limit(8)
                    break;
                default:
                    sortedProducts = await productdb.find({ list:'listed' }).limit(8)
            }
            
            
            
            res.json({sortedProducts,pages})
            res.status(200)

          
} catch (error) {
    console.log(error);
    res.redirect('/error500')
    
}
}


       


const nocata= async(req,res)=>{
    try{
        const category=req.body.items
        
        const products = await productdb.find({list:'listed'}).populate("Category").limit(8).sort({_id : -1 });
        let pages = await productdb.countDocuments();
        pages = Math.ceil(pages/8)
        for (const product of products) {
            await applyoffer(product);
        }

        
         res.status(200).json({products,pages})
           
            
       
       }catch(err){
        console.log(err);
        res.redirect('/error500')
       }
}


const search=async(req,res)=>{
     
     try {

        const query=req.body.word.trim()
        const regex = new RegExp(query, 'i');

        
        const products = await productdb.find({
            $or: [
                { product_name: { $regex: regex } },
                { brand: { $regex: regex } },
                { color: { $regex: regex } },
                { description: { $regex: regex } }
            ]
        });
        for (const product of products) {
            await applyoffer(product);
        }

        res.status(200).json(products);
     } catch (error) {
        console.log(err);
        res.redirect('/error500')
     }
}

const allpage=async(req,res)=>{
    const{page,cata,sort}=req.query

    let jump = (page-1) * 8;
    let next= await productdb.find()
    for (const sortedProduct of next) {
        await applyoffer(sortedProduct);
    }

    switch(sort){
        case '1':next = await productdb.find({ list:'listed' }).limit(8).skip(jump).populate("Category");
             break;
        case '2': 
                  next  = await productdb.find({ list:'listed' }).sort({ price: 1,offerPrice:1,discount:1  }).limit(8).skip(jump).populate("Category");
              
            break;
        case '3':
                next = await productdb.find({ list:'listed' }).sort({ price: -1,offerPrice:-1,discount:-1 }).limit(8).skip(jump).populate("Category");
            break;
        case '4':
                next = await productdb.find({ list:'listed' }).sort({ product_name: 1 }).limit(8).skip(jump).populate("Category");
                break;
        case '5':
                next = await productdb.find({list:'listed' }).sort({ product_name: -1 }).limit(8).skip(jump).populate("Category");
            break;    
        case '6':
            next = await productdb.find({list:'listed' }).sort({ _id: -1 }).limit(8).skip(jump).populate("Category");
            break;
        default:
            next = await productdb.find({ list:'listed'}).populate("Category");
    }
    
    return res.status(200).json({ next});
}


const pagination=async(req,res)=>{
    
 
 
 const{page,cata,sort}=req.query

 let jump = (page-1) * 8;
 
 let next= await productdb.find()
 for (const sortedProduct of next) {
     await applyoffer(sortedProduct);
 }

 
    const category = await categorydb.findById(cata)
    switch(sort){
        case '1':next = await productdb.find({ Category: category.id,list:'listed' }).limit(8).skip(jump).populate("Category");
             break;
        case '2': 
                  next  = await productdb.find({ Category: category.id,list:'listed' }).sort({price: 1,offerPrice:1,discount:1 }).limit(8).skip(jump).populate("Category");
              
            break;
        case '3':
                next = await productdb.find({ Category: category.id,list:'listed' }).sort({price: -1,offerPrice:-1,discount:1  }).limit(8).skip(jump).populate("Category");
            break;
        case '4':
                next = await productdb.find({ Category: category.id,list:'listed' }).sort({ product_name: 1 }).limit(8).skip(jump).populate("Category");
                break;
        case '5':
                next = await productdb.find({ Category: category.id,list:'listed' }).sort({ product_name: -1 }).limit(8).skip(jump).populate("Category");
            break;    
        case '6':
            next = await productdb.find({ Category: category.id,list:'listed' }).sort({ _id: -1 }).limit(8).skip(jump).populate("Category");
            break;
        default:
            next = await productdb.find({ Category: category.id, list:'listed'}).populate("Category");
    }
    
    return res.status(200).json({ next});

}


 
    
    // const next = await productdb.find({list:'listed'}).populate("Category").limit(8).skip(jump).sort({_id : -1 });
    // return res.status(200).json({ next});






module.exports={
    men,kid,women,allproduct,shopeCata,sort_product,Catasort,nocata,search,pagination,allpage
}