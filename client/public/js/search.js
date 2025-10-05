// search.js - 修复搜索功能
document.addEventListener('DOMContentLoaded', async function() {
    // 渲染导航栏
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.appendChild(renderNavigation());
    }
    
    // 加载活动类别
    await loadEventCategories();
    
    // 绑定搜索表单事件
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
    
    // 绑定重置按钮事件
    const resetBtn = searchForm?.querySelector('button[type="reset"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSearch);
    }
});

// 加载活动类别
async function loadEventCategories() {
    try {
        const categories = await getCategories();
        const categorySelect = document.getElementById('category');
        
        if (categorySelect) {
            // 清空现有选项（除了"所有类别"）
            categorySelect.innerHTML = '<option value="">所有类别</option>';
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.category_name;
                option.textContent = category.category_name;
                categorySelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('加载活动类别失败:', error);
    }
}

// 获取类别数据
async function getCategories() {
    try {
        const response = await fetch('http://localhost:3001/api/categories');
        if (!response.ok) {
            throw new Error('网络请求失败');
        }
        return await response.json();
    } catch (error) {
        console.error('获取类别失败:', error);
        return [];
    }
}

// 处理搜索请求
async function handleSearch(e) {
    e.preventDefault();
    
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value.trim();
    const category = document.getElementById('category').value;
    
    console.log('搜索条件:', { date, location, category }); // 调试信息
    
    try {
        // 构建查询参数
        const params = new URLSearchParams();
        
        if (date) {
            params.append('date', date);
        }
        if (location) {
            params.append('location', location);
        }
        if (category) {
            params.append('category', category);
        }
        
        // 如果没有选择任何筛选条件，显示所有活动
        if (params.toString() === '') {
            alert('请选择至少一个筛选条件');
            return;
        }
        
        const url = `http://localhost:3001/api/events/search?${params.toString()}`;
        console.log('搜索URL:', url);
        
        // 显示加载状态
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '<p class="loading">搜索中...</p>';
        
        const response = await fetch(url);
        console.log('响应状态:', response.status);
        
        if (!response.ok) {
            throw new Error(`网络请求失败: ${response.status} ${response.statusText}`);
        }
        
        const events = await response.json();
        console.log('搜索结果:', events);
        displaySearchResults(events);
        
    } catch (error) {
        console.error('搜索失败:', error);
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="error-message">
                    <p>搜索失败: ${error.message}</p>
                    <p>请检查：</p>
                    <ul>
                        <li>API服务器是否运行在 localhost:3001</li>
                        <li>网络连接是否正常</li>
                        <li>控制台是否有更多错误信息</li>
                    </ul>
                </div>
            `;
        }
    }
}

// 重置搜索
function resetSearch() {
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
        resultsContainer.innerHTML = '<p class="empty-results">暂无匹配的活动</p>';
    }
}

// 显示搜索结果
function displaySearchResults(events) {
    const resultsContainer = document.getElementById('results-container');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    if (!events || events.length === 0) {
        resultsContainer.innerHTML = '<p class="empty-results">没有找到匹配的活动</p>';
        return;
    }
    
    const eventsGrid = document.createElement('div');
    eventsGrid.className = 'events-grid';
    
    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <div class="event-image">
                <img src="${event.image_url || 'https://via.placeholder.com/300x200?text=Event+Image'}" 
                     alt="${event.event_name}" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Event+Image'">
            </div>
            <div class="event-info">
                <h3>${event.event_name}</h3>
                <p><i class="far fa-calendar"></i> ${formatDate(event.event_date)}</p>
                <p><i class="far fa-map-marker-alt"></i> ${event.location}</p>
                <p><i class="far fa-tag"></i> ${event.category_name}</p>
                <p class="event-desc">${event.description ? event.description.substring(0, 100) + '...' : '暂无描述'}</p>
                <div class="event-meta">
                    <span class="ticket-price">${event.ticket_price > 0 ? `票价: ${event.ticket_price}元` : '免费参加'}</span>
                    <span class="goal-amount">目标: ${event.goal_amount}元</span>
                </div>
                <a href="event-details.html?id=${event.id}" class="btn">查看详情</a>
            </div>
        `;
        eventsGrid.appendChild(eventCard);
    });
    
    resultsContainer.appendChild(eventsGrid);
}

// 日期格式化函数
function formatDate(dateString) {
    if (!dateString) return '日期待定';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '日期待定';
        }
        return date.toLocaleDateString('zh-CN', { 
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('日期格式化错误:', error);
        return '日期待定';
    }
}