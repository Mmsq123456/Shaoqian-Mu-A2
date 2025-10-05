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

// 启动服务器
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});