// server.js
const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/events');
const categoryRoutes = require('./routes/categories');
const { pool } = require('./event_db');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoryRoutes);

// 根路由
app.get('/', (req, res) => {
    res.send('Charity Events API is running');
});

// 健康检查路由
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API is running' });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});

// 在 server.js 的 routes 部分添加
app.get('/api/test/search', (req, res) => {
    console.log('测试搜索端点被调用');
    res.json([
        {
            id: 1,
            event_name: "测试活动1",
            event_date: "2025-10-15",
            location: "Sydney",
            category_name: "Gala Dinner",
            description: "这是一个测试活动",
            ticket_price: 100,
            goal_amount: 50000
        },
        {
            id: 2,
            event_name: "测试活动2", 
            event_date: "2025-10-20",
            location: "Melbourne",
            category_name: "Fun Run",
            description: "这是另一个测试活动",
            ticket_price: 50,
            goal_amount: 10000
        }
    ]);
});