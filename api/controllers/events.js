// controllers/events.js
const { query } = require('../event_db');

// 获取即将举办的活动（首页）
async function getupcomingEvents(req, res) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const [results] = await query(
            `SELECT e.*, c.category_name, o.org_name, o.logo_url 
             FROM events e
             JOIN event_categories c ON e.category_id = c.id
             JOIN charity_organizations o ON e.org_id = o.id
             WHERE e.event_date >= ? AND e.status = 'upcoming'
             ORDER BY e.event_date`,
            [today]
        );
        res.json(results);
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// 根据ID获取活动详情
async function getEventById(req, res) {
    try {
        const eventId = req.params.id;
        const [results] = await query(
            `SELECT e.*, c.category_name, o.org_name, o.mission_statement, o.contact_info
             FROM events e
             JOIN event_categories c ON e.category_id = c.id
             JOIN charity_organizations o ON e.org_id = o.id
             WHERE e.id = ?`,
            [eventId]
        );
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// 搜索活动
async function searchEvents(req, res) {
    try {
        console.log('搜索请求参数:', req.query); // 添加日志
        
        const { date, location, category } = req.query;
        let queryStr = `SELECT e.*, c.category_name, o.org_name 
                        FROM events e
                        JOIN event_categories c ON e.category_id = c.id
                        JOIN charity_organizations o ON e.org_id = o.id
                        WHERE 1=1`; // 使用 1=1 简化条件拼接
        const params = [];
        
        if (date) {
            queryStr += ` AND e.event_date = ?`;
            params.push(date);
        }
        
        if (location) {
            queryStr += ` AND e.location LIKE ?`;
            params.push(`%${location}%`);
        }
        
        if (category) {
            queryStr += ` AND c.category_name = ?`;
            params.push(category);
        }
        
        // 只显示即将举办的活动
        queryStr += ` AND e.status = 'upcoming'`;
        
        queryStr += ` ORDER BY e.event_date`;
        
        console.log('执行的SQL:', queryStr); // 调试日志
        console.log('参数:', params); // 调试日志
        
        const [results] = await query(queryStr, params);
        console.log('搜索结果数量:', results.length); // 调试日志
        
        res.json(results);
    } catch (error) {
        console.error('搜索活动错误:', error);
        res.status(500).json({ error: '服务器错误: ' + error.message });
    }
}

module.exports = {
    getupcomingEvents,
    getEventById,
    searchEvents
};