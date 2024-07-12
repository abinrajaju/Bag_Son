const express= require("express")
const route=express.Router();
const controller=require('../controller/user_control/user_Controller');
const check= require("../middleware/check");
const product=require('../controller/user_control/category_crl')
const profile=require('../controller/user_control/profile_control')
const cart=require('../controller/user_control/cart_control')
const checkout=require('../controller/user_control/checkout_control')
const admin=require('../controller/admin_control/admin_controller')


//login&signup
route.get('/',admin.index)
route.get('/userlogin',controller.get_login)
route.get('/usersignup',controller.get_sign)
route.post('/usersignup',controller.signup)
route.post('/otp',controller.verify);
route.get('/resend',controller.resend)
route.post('/userlogin',controller.post_login)
route.get('/userlogout',controller.logout)


//shop
route.get('/productdetail',check.active,controller.productDetail)
route.get('/mens',check.active,product.men)
route.get('/block',check.active,controller.block)
route.get('/women',check.active,product.women)
route.get('/kid',check.active,product.kid)
route.get('/prod',product.allproduct)
route.post('/shop',product.shopeCata)
route.post('/productsort',product.sort_product)
route.post('/outsort',product.Catasort)
route.post('/allshop',product.nocata)
route.post('/search',product.search)






//user profile
route.get('/profile',check.checklog,profile.profile)
route.get('/useraddress',check.active,profile.address)
route.get('/userorders',check.active,profile.userorders)
route.get('/wishlisted',check.active,profile.wishlisted)
route.get('/wishlist/:id',check.active,profile.add_wishlist)
route.delete('/deleteWishlist/:id',check.active,profile.remove_wishlist)
route.get('/addaddress',check.active,profile.get_address)
route.post('/addaddress',check.active,profile.add_address)
route.delete('/useraddress/:id',check.active,profile.delete_address)
route.get('/cancelOrder/:orderId',check.active,profile.cancelOrder)
route.get('/wallethistory',check.active,profile.getwallet)
route.get('/orderDetail/:id',check.active,profile.orderDetail)
route.get('/returnOrder/:id',check.active,profile.retur)
//cart
route.get('/cart',check.checklog,cart.get_cart)
route.get('/cart/:id',check.checklog,cart.add_cart)
route.get('/remove/:id',check.active,cart.remove)
route.put('/up-quantity/:id',check.active,cart.update_quandity)
route.post('/up-amount',check.active,cart.update_amount)




//forgot
route.get('/forgot',controller.forgot)
route.post('/forgot',controller.post_forgot)
route.post('/forgototp',controller.forgot_verify)
route.post('/reset',controller.reset_password)
route.get('/forgot-resend',controller.forgot_resent)


//checkout 
route.get('/checkout',check.active,checkout.get_checkout)
route.post('/stockresult',check.active,checkout.oder_place)
route.post('/verifyStock',check.active,checkout.check_stock)
route.get('/thankyou',check.active,checkout.placed)
route.post('/razorpayment',check.active,checkout.onlinepayment)
route.post('/onlinepayment',check.active,checkout.onlinepayed)
route.post('/walletpay',check.active,checkout.walletpay)
route.post('/applyCoupon',check.active,checkout.apply_coupon)
route.all('*',(req,res,next)=>{
    res.redirect('/error500')
})

module.exports=route