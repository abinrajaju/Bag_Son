const jwt=require('jsonwebtoken')
const Categorydb = require('../../model/category');
const productdb = require('../../model/product');
const userdb=require('../../model/usermodel')






const list=async(req,res)=>{
    try{
        const category=await Categorydb.find()
    
        res.render('admin/category',{category})
    }catch(err){
        console.error(err)
        res.render('admin/err500')
    }

    // res.render('admin/category')
 }


 const get_add=async(req,res)=>{
    res.render('admin/add_category',{message:""})
 }

 const user_detail = async (req, res) => {
    
    const allusers = await userdb.find()
    


    
    res.render('admin/userDetails', { allusers});
}
 
 







const add_category=async(req,res)=>{
    try{
        
        if(!req.body){
            res.status(400).send({message:'content cannot be empty'})
            return;
        }
        const { CategoryName, discription } = req.body;

        if (!CategoryName || CategoryName.trim() === '') {
            return res.status(400).render('addcategory', { message: 'Category name cannot be empty' });
        }
        const trimmedCategoryName = CategoryName.trim();
        let category = await Categorydb.findOne({
            CategoryName: { $regex: new RegExp(`^${trimmedCategoryName}$`, 'i') }
        });
        
        if(category){
            res.render('admin/add_category',{message:'category already exist'})
            return;
        }else{
            const newCategory= new Categorydb({
                CategoryName:CategoryName,
                description:discription
            })
           
            await newCategory.save();
            res.redirect('/category')
        }
    }catch (err) {
        console.log(err);
        res.status(500).render('admin/err500')
    }
}


const get_edit=async(req,res)=>{
    const id =req.params.id
    const get= await Categorydb.findById(id)
    const message=''
    res.render('admin/edit_category',{get,message})
 }

 const post_edit=async(req,res)=>{
    try{
        const categoryId=req.params.id;
        const updateData=req.body
        
        const get = await Categorydb.findById(categoryId)
        const categorysame=await Categorydb.findOne({
            CategoryName: { $regex: new RegExp(`^${trimmedCategoryName}$`, 'i') }
        });
        if(categorysame){
            return res.render('admin/edit_category',{get,message:'category already exist'})
        }
        const updateCategory=await Categorydb.findByIdAndUpdate(categoryId,updateData,{new:true})
       await updateCategory.save()
        res.redirect('/category')
    }catch(err){
        console.error(err);
        res.render('admin/err500')
    }
 }

 const delet =async(req,res)=>{
     try{
        const id =req.params.id;
      await  productdb.deleteMany({Category:id})
      const data= await Categorydb.findByIdAndDelete(id)
      if(!data){
        res.status(404).send({message:`cannot delete this with id ${id}`})
      }else{
        res.send({messege:'category and accociated product deleted succedfully'})
      }
     }catch(err){
        res.status(500).send({message:"could not delete this product"})
     }

 }



 module.exports={
    list,get_add,user_detail,add_category,get_edit,post_edit,delet
 }





 