const express= require("express")
const route=express.Router();
const controller=require('../controller/user_control/user_Controller');
const check= require("../middleware/check");
const product=require('../controller/user_control/category_crl')
const profile=require('../controller/user_control/profile_control')
const cart=require('../controller/user_control/cart_control')
const checkout=require('../controller/user_control/checkout_control')



//login&signup
route.get('/',controller.index)
route.get('/userlogin',controller.get_login)
route.get('/usersignup',controller.get_sign)
route.post('/usersignup',controller.signup)
route.post('/otp',controller.verify);
route.get('/resend',controller.resend)
route.post('/userlogin',controller.post_login)
route.get('/userlogout',controller.logout)


//shop
route.get('/productdetail',check.checklog,controller.productDetail)
route.get('/mens',product.men)
route.get('/block',controller.block)
route.get('/women',product.women)
route.get('/kid',product.kid)
route.get('/prod',product.allproduct)
route.post('/shop',product.shopeCata)






//user profile
route.get('/profile',check.checklog,profile.profile)
route.get('/useraddress',check.checklog,profile.address)
route.get('/userorders',check.checklog,profile.userorders)
route.get('/wishlisted',check.checklog,profile.wishlisted)
route.get('/wishlist/:id',profile.add_wishlist)
route.delete('/deleteWishlist/:id',profile.remove_wishlist)
route.get('/addaddress',profile.get_address)
route.post('/addaddress',profile.add_address)
route.delete('/useraddress/:id',profile.delete_address)
route.get('/cancelOrder/:orderId',profile.cancelOrder)
route.get('/wallethistory',profile.getwallet)

//cart
route.get('/cart',cart.get_cart)
route.get('/cart/:id',cart.add_cart)
route.get('/remove/:id',cart.remove)




//forgot
route.get('/forgot',controller.forgot)
route.post('/forgot',controller.post_forgot)
route.post('/forgototp',controller.forgot_verify)
route.post('/reset',controller.reset_password)
route.get('/forgot-resend',controller.forgot_resent)


//checkout 
route.get('/checkout',checkout.get_checkout)
route.post('/stockresult',checkout.oder_place)
route.post('/verifyStock',checkout.check_stock)
route.get('/thankyou',checkout.placed)
route.post('/razorpayment',checkout.onlinepayment)
route.post('/onlinepayment',checkout.onlinepayed)
route.post('/walletpay',checkout.walletpay)
route.post('/applyCoupon',checkout.apply_coupon)

module.exports=route