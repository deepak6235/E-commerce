import { useState } from 'react'

import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import AdminHome from './components/Admin/AdminHome'
import ManageProducts from './components/Admin/ManageProducts'
import ManageUsers from './components/Admin/ManageUsers'
import AdminEditProduct from './components/Admin/AdminEditProduct'
import AdminAddProduct from './components/Admin/AdminAddProduct'
import AdminProductDetails from './components/Admin/AdminProductDetails'
import UserOrders from './components/Admin/UserOrders'
import ProductList from './components/User/ProductList'
import CartPage from './components/User/CartPage'
import CheckoutPage from './components/User/CheckoutPage'
import OrdersPage from './components/User/OrdersPage'
import PaymentPage from './components/User/PaymentDetailsPage'
import OrderTrackingPage from './components/User/OrderTrackingPage'
import WishlistPage from './components/User/WishlistPage'
import ProductDetails from './components/User/ProductDetails'
import SingleProductCheckout from './components/User/SingleProductCheckout'
import RegisterPage from './components/User/RegisterPage'
import UserProfile from './components/User/UserProfile'
import AdminOrderTracking from './components/Admin/OrderTracking'





function App() {
console.log(localStorage.getItem("token"))


  return (
    <Routes>

      <Route path='/' element={<Login/>} />

      
      <Route path='/admin-home' element={<AdminHome/>} />
      <Route path='/admin-products' element={<ManageProducts/>} />
      <Route path='/admin-users' element={<ManageUsers/>} />
      <Route path='/users/:id/orders' element={<UserOrders/>} />
      <Route path='/admin-products-add' element={<AdminAddProduct/>} />
      <Route path='/admin-products-edit/:id' element={<AdminEditProduct/>} />
      <Route path='/admin-product-view/:id' element={<AdminProductDetails/>} />
      <Route path="/admin/order/:orderId/track" element={<AdminOrderTracking/>} />







/////////user side////////////////////



<Route path='/user-register' element={<RegisterPage/>}/>
<Route path='/user-cart' element={<CartPage/>}/>
<Route path='/user-checkout' element={<CheckoutPage/>}/>
<Route path='/user-orders'  element={<OrdersPage/>}/>
<Route path='/user-products' element={<ProductList/>}/>
<Route path='/user-productdetail/:id' element={<ProductDetails/>}/>
<Route path='/user-wishlist' element={<WishlistPage/>}/>
<Route path='/payment/:orderId' element={<PaymentPage/>}/>
<Route path="/track/:orderId" element={<OrderTrackingPage/>} />
<Route path="/checkout/:id" element={<SingleProductCheckout/>} />
<Route path="/user-profile" element={<UserProfile/>} />





    </Routes>

  )
}

export default App
