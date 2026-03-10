var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products');
const { default: slugify } = require('slugify');

// READ ALL - không cần truy vấn, lấy toàn bộ sản phẩm chưa bị xoá
router.get('/', async function (req, res, next) {
  try {
    let result = await productModel.find({ isDeleted: false }).populate('category');
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// READ ONE - lấy sản phẩm theo ID
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await productModel.findOne({
      isDeleted: false,
      _id: id
    }).populate('category');
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: 'ID NOT FOUND' });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

// CREATE - tạo sản phẩm mới
router.post('/', async function (req, res, next) {
  try {
    let newProduct = new productModel({
      title: req.body.title,
      slug: slugify(req.body.title, {
        replacement: '-',
        lower: true,
        strict: false,
      }),
      price: req.body.price,
      description: req.body.description,
      images: req.body.images,
      category: req.body.category,
    });
    await newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// UPDATE - cập nhật sản phẩm theo ID
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    // Nếu có cập nhật title thì tạo lại slug
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, {
        replacement: '-',
        lower: true,
        strict: false,
      });
    }
    let updatedItem = await productModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updatedItem) {
      res.send(updatedItem);
    } else {
      res.status(404).send({ message: 'ID NOT FOUND' });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// DELETE (soft delete) - đánh dấu isDeleted = true
router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await productModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (updatedItem) {
      res.send({ message: 'Xoá thành công', data: updatedItem });
    } else {
      res.status(404).send({ message: 'ID NOT FOUND' });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;

