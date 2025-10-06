const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '1137326387',
    database: 'charityevents_db'
};

// 创建数据库连接池
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 测试连接
pool.getConnection()
    .then(connection => {
        console.log('数据库连接成功');
        connection.release();
    })
    .catch(err => {
        console.error('数据库连接失败:', err);
    });

// 导出连接池
module.exports = {
    pool,
    query: (sql, params) => pool.query(sql, params)
};