const { check, validationResult } = require('express-validator')
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
require("dotenv").config();

exports.createUser = async(req,res) =>{
  console.log("sami")
    console.log(req.body)
    const {name,email,password} = req.body
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({error : errors.array()[0].msg})
    }
    try {
      let user = await User.findOne({email})
      if(user){
        return res.status(400).json({error : "user already exit"})
      }
      let newUser = new User({name,email,password})
      let salt = await bcrypt.genSalt(10)
      newUser.password = await bcrypt.hash(password,salt)
      await newUser.save()
      jwt.sign({
        user: { id: newUser._id }
      },process.env.SECRET,{
        expiresIn: '7d'
      }, (err, token) => {
        if (err) throw err
  
        res.json({ token })
      })
  
      
    }  catch (e) {
      console.log(e)
      res.status(500).send('Server error')
    }
  

}





exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.products.forEach(product => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      count : product.count,
      price: product.price,
      transaction_id: req.body.transaction_id
    });
  })
    //store thi in DB
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { purchases: purchases } },
      { new: true },
      (err, purchases) => {
        if (err) {
          return res.status(400).json({
            error: "Unable to save purchase list"
          });
        }
        next();
      }
    );
}