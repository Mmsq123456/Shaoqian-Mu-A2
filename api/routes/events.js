// routes/events.js
const express = require('express');
const eventController = require('../controllers/events');

const router = express.Router();

// 获取所有即将举办的活动（首页数据）
router.get('/upcoming', eventController.getupcomingEvents);

// 搜索活动 - 这个路由必须在 :id 路由之前定义！
router.get('/search', eventController.searchEvents);

// 获取活动详情
router.get('/:id', eventController.getEventById);

module.exports = router;