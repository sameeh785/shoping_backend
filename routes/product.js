const express = require('express');
const router = express.Router();
const {deleteProduct,createProduct,getAllProducts,getSingleProduct,updateProduct,photo,singleProduct} = require('../controllers/product')
const {auth,checkEmploye} = require('../middleware/auth')
router.post('/create/product',auth,checkEmploye,createProduct);
router.get('/Allproducts',getAllProducts);
router.get('/singleproduct/:productId',singleProduct);
router.get('/product/:productId',getSingleProduct);
router.delete('/delete/product/:productId',auth,checkEmploye,deleteProduct);
router.put('/update/product/:productId',auth,checkEmploye,updateProduct);
router.get("/product/photo/:productId", photo);
module.exports = router;

