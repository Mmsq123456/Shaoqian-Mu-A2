const { query } = require('../event_db');

// 获取即将举办的活动（首页）
async function getUpcomingEvents(req, res) {
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
        const { date, location, category } = req.query;
        let queryStr = `SELECT e.*, c.category_name, o.org_name 
                        FROM events e
                        JOIN event_categories c ON e.category_id = c.id
                        JOIN charity_organizations o ON e.org_id = o.id
                        WHERE e.status = 'upcoming'`;
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
        
        queryStr += ` ORDER BY e.event_date`;
        
        const [results] = await query(queryStr, params);
        res.json(results);
    } catch (error) {
        console.error('Error searching events:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    getUpcomingEvents,
    getEventById,
    searchEvents
};