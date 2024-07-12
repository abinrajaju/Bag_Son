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
        res.render('user/products',{products,category})
    
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
    
    res.render('user/products',{products,category})
    
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
    
    res.render('user/products',{products,category})
    
    }catch(err){
        console.error(err);
       res.redirect('/err500')
    }
}


const allproduct=async(req,res)=>{
    try{
        
        const user= await userdb.findOne({email: req.session.email})
        let cartCount = 0;
        const products = await productdb.find({list:'listed'}).populate("Category")
        const category=await categorydb.find(); 
      if(user){
        const cart = await cartdb.findOne({ user: user._id });
            cartCount = cart ? cart.items.length : 0;
          const  wishlist = await wishlistdb.findOne({ user: user._id });
           let wishCount = wishlist ? wishlist.items.length: 0;
       
        for (const product of products) {
            await applyoffer(product);
        }
        
            res.render('user/products',{products,mencategory:"",wishCount,cartCount,category})
      }else{
        res.render('user/products',{products,mencategory:"",wishCount:0,cartCount:0,category})
      }
        
    }catch(err){
        console.log(err);
        res.redirect('/error500')
    }
}



const shopeCata=async(req,res)=>{
    try{
     const category=req.body.items
     
     const products = await productdb.find({ Category: category,list:'listed' }).populate('Category');
     
      res.status(200).json(products)
        
         
    
    }catch(err){
     console.log(err);
     res.redirect('/error500')
    }
 }
 



 const sort_product=async(req,res)=>{
    try {
       
        let sortedProducts
        const sortBySelect = req.body.selsect;
        const categoryId=req.body.selectedItemId
        const category = await categorydb.findById(categoryId)
        
       
         
        switch(sortBySelect){
            case '2': 
                    sortedProducts = await productdb.find({ Category: category.id,list:'listed' }).sort({ price: 1 }).populate("Category");
                  
                break;
            case '3':
                    sortedProducts = await productdb.find({ Category: category.id,list:'listed' }).sort({ price: -1 }).populate("Category");
                break;
            case '4':
                    sortedProducts = await productdb.find({ Category: category.id,list:'listed' }).sort({ product_name: 1 }).populate("Category");
                    break;
            case '5':
                    sortedProducts = await productdb.find({ Category: category.id,list:'listed' }).sort({ product_name: -1 }).populate("Category");
                break;    
            case '6':
                sortedProducts = await productdb.find({ Category: category.id,list:'listed' }).sort({ _id: -1 }).populate("Category");
                break;
            default:
                sortedProducts = await productdb.find({ Category: category.id, list:'listed'}).populate("Category");
        }
        for (const sortedProduct of sortedProducts) {
            await applyoffer(sortedProduct);
        }
        
        res.json(sortedProducts)
        res.status(200)
    } catch (error) {
        console.log(error);
        res.redirect('/error500')
    }
}


const Catasort=async(req,res)=>{
try {             

        let sortedProducts
        const sortBySelect = req.body.selsect;
       

            switch(sortBySelect){
                case '2': 
                        sortedProducts = await productdb.find({ list:'listed' }).sort({ price: 1 })
                      
                    break;
                case '3':
                        sortedProducts = await productdb.find({ list:'listed' }).sort({ price: -1 })
                    break;
                case '4':
                        sortedProducts = await productdb.find({ list:'listed' }).sort({ product_name: 1 })
                        break;
                case '5':
                        sortedProducts = await productdb.find({ list:'listed' }).sort({ product_name: -1 })
                    break;    
                case '6':
                    sortedProducts = await productdb.find({ list:'listed' }).sort({ _id: -1 })
                    break;
                default:
                    sortedProducts = await productdb.find({ list:'listed' })
            }
            for (const sortedProduct of sortedProducts) {
                await applyoffer(sortedProduct);
            }
            
            res.json(sortedProducts)
            res.status(200)

          
} catch (error) {
    console.log(error);
    res.redirect('/error500')
    
}
}


const nocata= async(req,res)=>{
    try{
        const category=req.body.items
        
        const products = await productdb.find({ list:'listed' })
        
         res.status(200).json(products)
           
            
       
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
                { size: { $regex: regex } },
                { description: { $regex: regex } }
            ]
        });
        

        res.status(200).json(products);
     } catch (error) {
        console.log(err);
        res.redirect('/error500')
     }
}

module.exports={
    men,kid,women,allproduct,shopeCata,sort_product,Catasort,nocata,search
}