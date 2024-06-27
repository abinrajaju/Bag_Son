const express= require("express")
const route=express.Router();
const controller=require('../controller/admin_control/admin_controller')
const check =require('../middleware/check')
const categoryController=require('../controller/admin_control/category')
const productController=require('../controller/admin_control/product')
const multer= require('multer')
const path=require('path')
const orderController=require('../controller/admin_control/order_control')
const coupon=require('../controller/admin_control/coupon')

//multer/
const storage=multer.diskStorage({
    destination:'uploads/',
    filename:function (req,file,cb){
        const uniqueSuffix= Date.now()+'-'+Math.round(Math.random() * 1E9);
        const fileExtension= path.extname(file.originalname);
        cb(null,file.fieldname+'-'+ uniqueSuffix + fileExtension);
 
    }
});
const upload=multer({storage:storage});



route.get('/admin',check.adminCheck,controller.admindash)
route.get('/adminsignup',controller.adminlogin)
route.get('/admin',controller.admindash)
route.get('/adminlogout',check.adminCheck,controller.adminlogout)
route.get('/category',categoryController.list)
route.get('/addcategory',categoryController.get_add)
route.get('/userdetail',categoryController.user_detail)
route.get('/products',productController.list)
route.get('/addproduct',productController.add_product)
route.get('/edit/:id',categoryController.get_edit)
route.get('/productedit/:id',productController.get_edit)
route.get('/error500',controller.err)
route.get('/blockuser',controller.block)



route.post('/adminsignup',controller.adminsign)
route.post('/addcategory',categoryController.add_category)
route.post('/multproduct',upload.array('images',4),productController.creatProduct)
route.post('/edit/:id',categoryController.post_edit)
route.delete('/category-delete/:id',categoryController.delet) 
route.post('/productedit/:id',upload.array('images',4),productController.post_edit)
route.delete('/product-delete/:id',productController.pro_delete)
route.delete('/delete-image/:productId/:imageIndex',productController.deleteImage)
route.get('/orders',orderController.get_order)
route.post('/updateOrderStatus/:orderId',orderController.updateStatus)


//coupon
route.get('/coupon',coupon.get_coupon)
route.get('/addCoupons',coupon.add_coupon)
route.post('/addCoupons',coupon.add)
route.delete('/couponDelete/:id',coupon.delet)
route.get('/editCoupon/:id',coupon.edit)
route.post('/editCoupon/:id',coupon.post_edit)


module.exports=route