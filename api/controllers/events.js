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

// 根据ID获取活动详情 - 增强版
async function getEventById(req, res) {
    try {
        const eventId = req.params.id;
        const [results] = await query(
            `SELECT e.*, c.category_name, o.org_name, o.mission_statement, o.contact_info, o.logo_url
             FROM events e
             JOIN event_categories c ON e.category_id = c.id
             JOIN charity_organizations o ON e.org_id = o.id
             WHERE e.id = ?`,
            [eventId]
        );
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        // 为每个活动添加详细内容
        const event = results[0];
        const enhancedEvent = {
            ...event,
            // 添加详细的活动描述
            detailed_description: getEventDetailedDescription(event.id, event.event_name),
            // 添加活动亮点
            highlights: getEventHighlights(event.id),
            // 添加活动日程
            schedule: getEventSchedule(event.id),
            // 添加注意事项
            notes: getEventNotes(event.id)
        };
        
        res.json(enhancedEvent);
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// 获取活动详细描述
function getEventDetailedDescription(eventId, eventName) {
    const descriptions = {
        1: `欢迎参加我们的年度慈善晚宴，这是一个充满优雅与温情的夜晚。活动将在悉尼豪华宴会厅举行，为您提供精致的五道菜晚宴，由顶级厨师精心准备。

当晚将有精彩的现场音乐表演、无声拍卖和激动人心的抽奖活动。所有筹集的资金将直接用于支持贫困儿童的教育和医疗需求。

这是一个与志同道合的慈善家交流的绝佳机会，同时也是为改变儿童生活做出实质性贡献的平台。`,
        
        2: `加入我们的5K慈善趣味跑，为环境保护事业贡献力量！无论您是专业跑者还是休闲跑步爱好者，这个活动都适合您。

路线穿越美丽的Centennial公园，沿途设有补水站和急救点。活动结束后，我们将在终点举办小型庆祝活动，提供健康小吃和饮料。

每位参与者将获得纪念T恤和完赛奖牌。让我们一起为地球奔跑！`,
        
        3: `"艺术为公益"拍卖会汇集了本地艺术家的精彩作品，包括绘画、雕塑和摄影作品。所有拍卖所得将用于支持医疗保健项目。

这是一个独特的社交活动，您可以在欣赏艺术的同时，为重要的医疗事业做出贡献。现场提供饮料和小食，并有专业拍卖师主持。`,
        
        4: `希望音乐会是一场不容错过的音乐盛宴！我们邀请了多位知名艺术家进行现场表演，涵盖流行、摇滚和古典音乐。

音乐会所有收入将用于支持儿童慈善机构，为弱势儿童提供教育和发展机会。带上您的朋友和家人，共同度过一个充满音乐和希望的夜晚。`,
        
        5: `生态工作坊系列旨在教育公众关于可持续生活的知识。工作坊内容包括：
• 家庭堆肥和废物减少
• 可持续食品选择
• 节能家居改造
• 环保清洁产品制作

适合所有年龄段的参与者，无需任何先验知识。`,
        
        8: `慈善美食节将带您踏上一场美食之旅！品尝来自本地餐厅和厨师的特色菜肴，同时支持饥饿救济工作。

活动特色：
• 50多个美食摊位
• 烹饪示范
• 儿童活动区
• 现场音乐表演

这是一个适合全家参与的活动，让您在享受美食的同时帮助有需要的人。`
    };
    
    return descriptions[eventId] || `${eventName} 的详细描述。这是一个有意义的慈善活动，我们期待您的参与和支持。`;
}

// 获取活动亮点
function getEventHighlights(eventId) {
    const highlights = {
        1: [
            "五星级五道菜晚宴",
            "现场爵士乐队表演", 
            "无声拍卖珍贵物品",
            "名人嘉宾出席",
            "抽奖活动奖品丰厚"
        ],
        2: [
            "风景优美的跑步路线",
            "专业计时服务",
            "完赛纪念奖牌",
            "健康早餐供应",
            "家庭友好活动"
        ],
        3: [
            "50+本地艺术家作品",
            "专业拍卖师主持",
            "艺术家现场交流",
            "免费饮料和小食",
            "支持医疗事业"
        ],
        4: [
            "多位知名艺术家表演",
            "高品质音响效果",
            "舒适的座位安排",
            "中场休息茶点",
            "支持儿童教育"
        ],
        5: [
            "实践性工作坊",
           '专业导师指导',
            "环保材料提供",
            "小班教学保证质量",
            "可持续生活技巧"
        ],
        8: [
            "多元文化美食",
            "现场烹饪示范",
            "儿童娱乐活动",
            "本地农产品展销",
            "支持饥饿救济"
        ]
    };
    
    return highlights[eventId] || ["有意义的活动", "支持慈善事业", "社区参与机会"];
}

// 获取活动日程
function getEventSchedule(eventId) {
    const schedules = {
        1: [
            "18:30 - 宾客入场及欢迎饮料",
            "19:00 - 晚宴开始",
            "20:00 - 主办方致辞",
            "20:30 - 无声拍卖",
            "21:30 - 现场音乐表演",
            "22:30 - 抽奖活动",
            "23:00 - 活动结束"
        ],
        2: [
            "07:30 - 参赛者报到",
            "08:00 - 热身活动",
            "08:30 - 5K跑开始",
            "09:30 - 颁奖仪式",
            "10:00 - 庆祝早餐",
            "11:00 - 活动结束"
        ],
        3: [
            "13:30 - 展览开放",
            "14:00 - 拍卖会开始",
            "15:30 - 茶歇时间",
            "16:00 - 继续拍卖",
            "17:30 - 成交确认",
            "18:00 - 活动结束"
        ]
    };
    
    return schedules[eventId] || ["详细日程将在活动前通知参与者"];
}

// 获取活动注意事项
function getEventNotes(eventId) {
    const notes = {
        1: [
            "请着正装或晚礼服出席",
            "建议提前15分钟到达",
            "提供免费代客停车服务",
            "特殊饮食需求请提前告知"
        ],
        2: [
            "建议穿着舒适的运动服装",
            "活动前请充分热身",
            "提供行李寄存服务",
            "未成年人需监护人陪同"
        ],
        3: [
            "现场接受现金和信用卡支付",
            "拍卖成功后需现场付款",
            "艺术品需在活动结束后取走",
            "提供免费包装服务"
        ],
        4: [
            "请按时入场以免影响他人",
            "演出期间请保持手机静音",
            "场内禁止摄影录像",
            "中场休息20分钟"
        ],
        5: [
            "建议携带笔记本记录",
            "提供所有所需材料",
            "工作坊提供茶点",
            "欢迎提问和讨论"
        ],
        8: [
            "建议使用公共交通",
            "提供素食选择",
            "儿童需成人陪同",
            "支持现金和电子支付"
        ]
    };
    
    return notes[eventId] || ["请按时参加", "如有特殊需求请提前联系主办方"];
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