const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root', // 替换为你的 MySQL 用户名
    password: '1137326387', // 替换为你的 MySQL 密码
    database: 'charityevents_db'
};

// 创建数据库连接池
const pool = mysql.createPool(dbConfig);

// 导出连接池
module.exports = {
    pool,
    query: (sql, params) => pool.query(sql, params)
};