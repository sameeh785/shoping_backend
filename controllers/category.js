const Category = require("../models/category");
const { validationResult } = require("express-validator");

exports.createCategory = async (req, res) => {
  console.log("catgeory");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  const name = await Category.findOne({ name: req.body.name }).exec();
  if (name) {
    return res.status(400).json({ error: "Category Already exist" });
  }
  const category = new Category(req.body);
  console.log(category);
  if (!category) {
    return res.status(400).json({ error: "Unable to create category" });
  }
  await category.save();
  res.json({ msg: "Category is created successfully" });
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id).exec();
  console.log(category);
  if (!category) {
    return res.status(400).json({ error: "Unable to delete category" });
  }
  res.json({ msg: "Category is deleted successfully" });
};

exports.getAllCategories = async (req, res) => {
  const categories = await Category.find({}).exec();
  console.log(categories);
  if (!categories) {
    return res.status(404).json({ error: "Please enter some categories" });
  }
  res.json(categories);
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!category) {
    return res.status(400).json({ error: "unable to update category" });
  }
  res.json({ msg: "Category is updated successfully" });
};

exports.singleCategory = async (req, res) => {
  const category = await Category.findById(req.params.id).exec();
  res.json(category)
};
