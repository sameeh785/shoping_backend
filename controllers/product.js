const Product = require("../models/product");
const formidable = require("formidable");
const fs = require("fs");
const _ = require('lodash')

//createProduct
exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
       error: "Problem with image",
      });
    }
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price  || !stock) {
      return res.status(400).json({error: "Please enter all the fields" });
    }
    let product = new Product(fields);
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({error: "File size too big!" });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    product.save((err, product) => {
      if (err) {
        console.log(err)
        return res.status(400).json({
         error: "Unable to save Product in DB",
        });
      }
      // res.json(product);
      res.json({msg : "Product has been Created"});

    });
  });
};

//update product
exports.updateProduct = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async(err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }
    let product = await Product.findById(req.params.productId).exec();
    product = _.extend(product, fields);
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updation of product failed",
        });
      }
      res.json({msg : "Product has been updated"});
    });
  });
};

//get Photo
exports.photo = async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (product.photo.data) {
    res.set("Content-Type",product.photo.contentType)
    return res.send(product.photo.data);
  }
  next();
};

//get Single Product
exports.getSingleProduct = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  if (!product) {
    return res.status(400).json({ msg: "Unable to get product" });
  }
  res.json(product);
};

exports.singleProduct = async (req, res) => {
  const product = await Product.findById(req.params.productId).select("-photo").exec();
  if (!product) {
    return res.status(400).json({ msg: "Unable to get product" });
  }
  res.json(product);
};

//get All products
exports.getAllProducts = async (req, res) => {
  const products = await Product.find({}).select("-photo").exec();
  if (!products) {
    return res.status(404).json({ error: "We dont have any productsm" });
  }
  // let array = [];
  // for(let i=0;i<products.length;i++){
  //   let product = products[i];
  //   product.photo = undefined;
  //   array.push(product)
  // }
  res.json(products);
};

// delete Products
exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.productId).exec();
  if (!product) {
    return res.status(400).json({ error: "Unable to delete the product" });
  }
  res.json({ msg: "Product is deleted" });
};

//update stock
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.products.map(prod => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } }
      }
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed"
      });
    }
    next();
  });
};
