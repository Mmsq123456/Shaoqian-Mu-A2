const express = require('express');
const categoryController = require('../controllers/categories');

const router = express.Router();

// 获取所有活动类别
router.get('/', categoryController.getAllCategories);

module.exports = router;