const express= require("express")
const route=express.Router();
const controller=require('../controller/user_control/user_Controller');
const check= require("../middleware/check");
const product=require('../controller/user_control/category_crl')
const profile=require('../controller/user_control/profile_control')
const cart=require('../controller/user_control/cart_control')
const checkout=require('../controller/user_control/checkout_control')
const admin=require('../controller/admin_control/admin_controller')
const invoice=require('../controller/user_control/invoicecontroller')


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
route.get('/block',controller.block)
route.get('/women',check.active,product.women)
route.get('/kid',check.active,product.kid)
route.get('/prod',check.active,product.allproduct)
route.post('/shop',check.active,product.shopeCata)
route.post('/productsort',check.active,product.sort_product)
route.post('/outsort',check.active,product.Catasort)
route.post('/allshop',check.active,product.nocata)
route.post('/search',check.active,product.search)
route.get('/viewmoreorder',check.active,product.pagination)
route.get('/allviewmoreorder',product.allpage)








//user profile
route.get('/profile',check.checklog,profile.profile)
route.get('/useraddress',check.active,profile.address)
route.get('/userorders',check.active,profile.userorders)
route.get('/wishlisted',check.checklog,check.active,profile.wishlisted)
route.get('/wishlist/:id',check.checklog,check.active,profile.add_wishlist)
route.delete('/deleteWishlist/:id',check.active,profile.remove_wishlist)
route.get('/addaddress',check.active,profile.get_address)
route.post('/addaddress',check.active,profile.add_address)
route.delete('/useraddress/:id',check.active,profile.delete_address)
route.get('/cancelOrder/:orderId',check.active,profile.cancelOrder)
route.get('/wallethistory',check.active,profile.getwallet)
route.get('/orderDetail/:id',check.active,profile.orderDetail)
route.get('/returnOrder/:id',check.active,profile.retur)
route.get('/orders/:orderId/invoice',check.active,invoice.generateOrderInvoice)
route.post('/update-user/:id',check.active,profile.editProfile)
route.get('/update-address',check.active,profile.geteditAdress)
route.post('/editaddress/:id',check.active,profile.editAddress)


//cart
route.get('/cart',check.checklog,check.active,cart.get_cart)
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
route.post('/stockresult',check.active,checkout.cod)
route.post('/verifyStock',check.active,checkout.check_stock)
route.get('/thankyou',check.active,checkout.placed)
route.post('/razorpayment',check.active,checkout.onlinepayment)
route.post('/onlinepayment',check.active,checkout.onlinepayed)
route.post('/walletpay',check.active,checkout.walletpay)
route.post('/applyCoupon',check.active,checkout.apply_coupon)
route.post('/failurePayment',check.active,checkout.failpayment)
route.post('/retryPayment',check.active,checkout.retrypayment)
route.post('/retrysucces',check.active,checkout.paymentSucces)
route.all('*',(req,res,next)=>{
    res.redirect('/error500')
})

module.exports=route