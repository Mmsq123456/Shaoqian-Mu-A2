// 移除 import 语句
document.addEventListener('DOMContentLoaded', async function() {
    const navbar = document.getElementById('navbar');
    navbar.appendChild(renderNavigation());
    
    // 加载即将举办的活动
    await loadUpcomingEvents();
});

// 加载即将举办的活动
async function loadUpcomingEvents() {
    try {
        const response = await fetch('http://localhost:3001/api/events/upcoming');
        if (!response.ok) {
            throw new Error('网络请求失败');
        }
        
        const events = await response.json();
        const eventsContainer = document.getElementById('events-container');
        eventsContainer.innerHTML = '';
        
        if (events.length === 0) {
            eventsContainer.innerHTML = '<p>暂无即将举办的活动</p>';
            return;
        }
        
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <div class="event-image">
                    <img src="${event.image_url || 'https://via.placeholder.com/300x200?text=Event+Image'}" alt="${event.event_name}">
                </div>
                <div class="event-info">
                    <h3>${event.event_name}</h3>
                    <p><i class="far fa-calendar"></i> ${formatDate(event.event_date)}</p>
                    <p><i class="far fa-map-marker-alt"></i> ${event.location}</p>
                    <p><i class="far fa-tag"></i> ${event.category_name}</p>
                    <p class="event-desc">${event.description.substring(0, 100)}...</p>
                    <a href="event-details.html?id=${event.id}" class="btn">查看详情</a>
                </div>
            `;
            eventsContainer.appendChild(eventCard);
        });
    } catch (error) {
        console.error('加载活动失败:', error);
        document.getElementById('events-container').innerHTML = '<p>加载活动失败，请稍后再试</p>';
    }
}

// 日期格式化函数
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
}