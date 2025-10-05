import { renderNavigation } from './nav.js';
import { getCategories } from './categories.js';

// 渲染导航栏
document.addEventListener('DOMContentLoaded', async function() {
    const navbar = document.getElementById('navbar');
    navbar.appendChild(renderNavigation());
    
    // 加载活动类别
    await loadEventCategories();
    
    // 绑定搜索表单事件
    document.getElementById('search-form').addEventListener('submit', handleSearch);
});

// 加载活动类别
async function loadEventCategories() {
    try {
        const categories = await getCategories();
        const categorySelect = document.getElementById('category');
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.category_name;
            option.textContent = category.category_name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('加载活动类别失败:', error);
    }
}

// 处理搜索请求
async function handleSearch(e) {
    e.preventDefault();
    
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value;
    const category = document.getElementById('category').value;
    
    try {
        let url = 'http://localhost:3001/api/events/search?';
        const params = [];
        
        if (date) {
            params.push(`date=${date}`);
        }
        if (location) {
            params.push(`location=${location}`);
        }
        if (category) {
            params.push(`category=${category}`);
        }
        
        if (params.length === 0) {
            alert('请选择至少一个筛选条件');
            return;
        }
        
        url += params.join('&');
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('网络请求失败');
        }
        
        const events = await response.json();
        displaySearchResults(events);
        
    } catch (error) {
        console.error('搜索失败:', error);
        document.getElementById('results-container').innerHTML = '<p>搜索失败，请稍后再试</p>';
    }
}

// 显示搜索结果
function displaySearchResults(events) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';
    
    if (events.length === 0) {
        resultsContainer.innerHTML = '<p class="empty-results">没有找到匹配的活动</p>';
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
        resultsContainer.appendChild(eventCard);
    });
}

// 日期格式化函数
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}