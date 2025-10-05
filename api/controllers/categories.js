const { query } = require('../event_db');

// 获取所有活动类别
async function getAllCategories(req, res) {
    try {
        const [results] = await query('SELECT * FROM event_categories');
        res.json(results);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    getAllCategories
};