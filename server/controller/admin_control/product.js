const productdb =require('../../model/product')
const Categorydb = require('../../model/category')
const path=require('path')




const list = async(req,res)=>{
    try{
        const categories =await Categorydb.find();
        const product = await productdb.find().populate('Category')
        res.render('admin/products',{categories,product})
    }catch(err){
        console.log(err);
        res.status(500).render('admin/err500')
    }
}

   
const creatProduct=async(req,res)=>{
    if(!req.body){
        res.render('admin/err500');
        return;
    }



if(!req.files||!Array.isArray(req.files)){
  console.log('no file uploded or flie not an array');
  res.status(400).send('no file uploaded')
}
const images = req.files.map(file=>file.path);
  

const price=parseInt(req.body.price);
console.log(req.body);
const discount=parseInt(req.body.discount)||0
if(isNaN(price)||isNaN(discount)){
    res.render('admin/err500');
    return;    
}
const totalprice=Math.round(price *(1 - discount/100))
try{
    
   
    const Category = await Categorydb.findById(req.body.Category)
    console.log(Category,"category");
    if(!Category){
        res.status(400).send({messege:'category not found'})
return
    }
    console.log("saving side");
    const product = new productdb({
        product_name: req.body.product_name,
        Category:Category._id,
        brand: req.body.brand,
        price: price,
        color: req.body.color,
        size: req.body.size,
        description: req.body.stat,
        discount: discount,
        stock: req.body.stock,
        images: images,
        total_price: totalprice,


    })
    await product.save();
    res.redirect('/products')
}catch(err){
    console.log(err);
    res.status(500).send({messege:'sumthing wrong'})
}
}




const add_product=async(req,res)=>{
    try{
        const categories=await Categorydb.find();
        res.render('admin/add_products',{categories})
    }catch(err){
        console.log(err);
        res.status(500).send('internal server error')
    }
}

const get_edit=async(req,res)=>{
    try {
        
            const id = req.params.id;
            
            
            const category = await Categorydb.find()
            const pro_get = await productdb.findById(id).populate('Category')
            


            res.render('admin/edit_product', { pro_get: pro_get, category: category })
         
    } catch (error) {
        console.error(error);
        res.redirect('admin/error500')
    }
}


const post_edit = async (req, res) => {

    try {
        const productId = req.params.id;
        const updateData = req.body;
        const images = req.files;

        const updatedproduct = await productdb.findByIdAndUpdate(productId, updateData, { new: true });
        if (images && images.length > 0) {
            updatedproduct.images = updatedproduct.images.concat(images.map(image => image.path));
        }

        await updatedproduct.save()

        res.redirect('/products')
    } catch (error) {
        console.error(error);
        res.render("error500")
    }
}


const pro_delete = async (req, res) => {
    try {

        const id = req.params.id;

        productdb.deleteMany({ productdb: id })
            .then(() => {
                productdb.findByIdAndDelete(id)
                    .then(data => {
                        if (!data) {
                            res.status(404).send({ message: `cannot delete with this id ${id}` })

                        } else {
                            res.send({ message: 'succesful' })
                        }
                    })
                    .catch(err => {
                        res.status(500).send({ message: 'could not delete this' })
                    })
            })
            .catch(err => {
                res.status(500).send({ message: 'could not delete this' })
            })
    } catch (error) {
        console.error(error)
        res.render('error500')
    }
}




const deleteImage = async (req, res) => {
    


    const { productId, imageIndex } = req.params;
    try {
        const product = await productdb.findById(productId)
        if (!productId) {
            return
        }
        product.images.splice(imageIndex, 1)
        await product.save();
        res.status(200).send('Image deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting the image: ' + error.message)
    }
}

const unlist = async (req, res) => {
    try {
        const productId = req.query.id;
        const product = await productdb.findById(productId)

        product.list = product.list === 'listed' ? 'blocked' : 'listed';
        await product.save();

        res.redirect('/products')
    }
    catch (error) {
        console.error("error blocking/unblocking user", error)
    }
}



module.exports={
    list,creatProduct,add_product,get_edit,post_edit,pro_delete,deleteImage,unlist
}
