const express = require('express');
const eventController = require('../controllers/events');

const router = express.Router();

// 获取所有即将举办的活动（首页数据）
router.get('/upcoming', eventController.getUpcomingEvents);

// 获取活动详情
router.get('/:id', eventController.getEventById);

// 搜索活动
router.get('/search', eventController.searchEvents);

module.exports = router;