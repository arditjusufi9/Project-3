const router = require('express').Router();
const express = require('express');
const path = require('path');


const { createUsers, updateUser, deleteUserByEmail,login, loginUser, createProduct, getAllProducts, deleteProduct, addProductToCart, shoppingCart } = require('../controllers/users');
const verifyToken = require('../middlewares/verifyToken');





router.post('/login', loginUser);
router.post('/createProduct', verifyToken, createProduct);
router.post('/createUsers',createUsers);
router.put('/',updateUser);
router.delete('/',deleteUserByEmail);
// router.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// router.post('/cart',addProductToCart)
router.get('/products',getAllProducts)
router.delete('/products/:productId',verifyToken,deleteProduct)
router.post('/shoppingCart',shoppingCart)



module.exports = router