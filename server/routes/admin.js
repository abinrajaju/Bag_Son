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
const offer=require('../controller/admin_control/offer_controller')

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




route.get('/adminsignup',controller.adminlogin)
route.get('/admin',controller.admindash)
route.get('/adminlogout',check.adminCheck,controller.adminlogout)
route.get('/category',check.adminCheck,categoryController.list)
route.get('/addcategory',check.adminCheck,categoryController.get_add)
route.get('/userdetail',check.adminCheck,categoryController.user_detail)
route.get('/products',check.adminCheck,productController.list)
route.get('/addproduct',check.adminCheck,productController.add_product)
route.get('/edit/:id',check.adminCheck,categoryController.get_edit)
route.get('/productedit/:id',check.adminCheck,productController.get_edit)
route.get('/error500',controller.err)
route.get('/blockuser',controller.block)



route.post('/adminsignup',controller.adminsign)
route.post('/addcategory',check.adminCheck,categoryController.add_category)
route.post('/multproduct',upload.array('images',4),productController.creatProduct)
route.post('/edit/:id',check.adminCheck,categoryController.post_edit)
route.delete('/category-delete/:id',check.adminCheck,categoryController.delet) 
route.post('/productedit/:id',check.adminCheck,upload.array('images',4),productController.post_edit)
route.delete('/product-delete/:id',check.adminCheck,productController.pro_delete)
route.delete('/delete-image/:productId/:imageIndex',check.adminCheck,productController.deleteImage)
route.get('/orders',check.adminCheck,orderController.get_order)
route.post('/updateOrderStatus/:orderId',check.adminCheck,orderController.updateStatus)
route.get('/orderDetails/:id',check.adminCheck,orderController.orderDetail)
route.post('/up-return/:id',check.adminCheck,orderController.updateReturn)

//coupon
route.get('/coupon',check.adminCheck,coupon.get_coupon)
route.get('/addCoupons',check.adminCheck,coupon.add_coupon)
route.post('/addCoupons',check.adminCheck,coupon.add)
route.delete('/couponDelete/:id',check.adminCheck,coupon.delet)
route.get('/editCoupon/:id',check.adminCheck,coupon.edit)
route.post('/editCoupon/:id',check.adminCheck,coupon.post_edit)



//offer
route.get('/offers',check.adminCheck,offer.get_offer)
route.get ('/addOffer',check.adminCheck,offer.add_offer)
route.post('/addoffer',check.adminCheck,offer.adding)
route.get('/offerlist',check.adminCheck,offer.unlistOffer)

module.exports=route