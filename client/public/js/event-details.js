// event-details.js
document.addEventListener('DOMContentLoaded', async function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.appendChild(renderNavigation());
    }
    
    // 从URL获取活动ID
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (!eventId) {
        alert('活动ID不存在');
        window.location.href = 'index.html';
        return;
    }
    
    // 加载活动详情
    await loadEventDetails(eventId);
});

// 加载活动详情
async function loadEventDetails(eventId) {
    const eventLoader = document.getElementById('event-loader');
    const eventContainer = document.getElementById('event-container');
    const eventError = document.getElementById('event-error');
    
    eventContainer.style.display = 'none';
    eventError.style.display = 'none';
    eventLoader.style.display = 'block';
    
    try {
        const response = await fetch(`http://localhost:3001/api/events/${eventId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                alert('活动不存在');
                window.location.href = 'index.html';
            } else {
                throw new Error('网络请求失败');
            }
            return;
        }
        
        const event = await response.json();
        renderEventDetails(event);
        
    } catch (error) {
        console.error('加载活动详情失败:', error);
        eventLoader.style.display = 'none';
        eventError.style.display = 'block';
    }
}

// 渲染活动详情
function renderEventDetails(event) {
    const eventLoader = document.getElementById('event-loader');
    const eventContainer = document.getElementById('event-container');
    const eventTitle = document.getElementById('event-title');
    
    eventLoader.style.display = 'none';
    eventContainer.style.display = 'block';
    
    // 更新页面标题
    if (eventTitle) {
        eventTitle.textContent = event.event_name;
    }
    document.title = `${event.event_name} - 慈善活动`;
    
    // 计算进度百分比
    const progress = event.raised_amount / event.goal_amount * 100;
    const progressBarWidth = `${Math.min(100, progress)}%`;
    
    eventContainer.innerHTML = `
        <div class="event-header">
            <img src="${event.image_url || 'https://via.placeholder.com/800x400?text=Event+Image'}" 
                 alt="${event.event_name}" 
                 class="event-banner"
                 onerror="this.src='https://via.placeholder.com/800x400?text=Event+Image'">
            <div class="event-meta">
                <h2>${event.event_name}</h2>
                <p><i class="fas fa-calendar"></i> ${formatDate(event.event_date)} ${event.event_time || ''}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <p><i class="fas fa-tag"></i> ${event.category_name}</p>
                <p><i class="fas fa-building"></i> 主办方: ${event.org_name}</p>
            </div>
        </div>
        
        <div class="event-content">
            <div class="event-main">
                <div class="event-description">
                    <h3><i class="fas fa-info-circle"></i> 活动描述</h3>
                    <p>${event.detailed_description || event.description}</p>
                </div>
                
                <div class="event-highlights">
                    <h3><i class="fas fa-star"></i> 活动亮点</h3>
                    <ul>
                        ${(event.highlights || []).map(highlight => `<li>${highlight}</li>`).join('')}
                    </ul>
                </div>
                
                ${event.schedule ? `
                <div class="event-schedule">
                    <h3><i class="fas fa-clock"></i> 活动日程</h3>
                    <ul>
                        ${event.schedule.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div class="event-notes">
                    <h3><i class="fas fa-exclamation-circle"></i> 注意事项</h3>
                    <ul>
                        ${(event.notes || []).map(note => `<li>${note}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="event-sidebar">
                <div class="event-fundraising">
                    <h3><i class="fas fa-chart-line"></i> 筹款进展</h3>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${progressBarWidth}"></div>
                    </div>
                    <div class="progress-metrics">
                        <span class="raised-amount">已筹集: ¥${event.raised_amount.toLocaleString()}</span>
                        <span class="goal-amount">目标: ¥${event.goal_amount.toLocaleString()}</span>
                        <span class="progress-percent">${progress.toFixed(1)}%</span>
                    </div>
                </div>
                
                <div class="event-ticket">
                    <h3><i class="fas fa-ticket-alt"></i> 票务信息</h3>
                    <p class="ticket-price">${event.ticket_price > 0 ? `票价: ¥${event.ticket_price}` : '免费参加'}</p>
                    <button id="register-btn" class="btn btn-primary">
                        <i class="fas fa-user-plus"></i> 立即注册
                    </button>
                    <button id="donate-btn" class="btn btn-secondary">
                        <i class="fas fa-heart"></i> 直接捐款
                    </button>
                </div>
                
                <div class="event-organization">
                    <h3><i class="fas fa-hands-helping"></i> 关于主办方</h3>
                    ${event.logo_url ? `<img src="${event.logo_url}" alt="${event.org_name}" class="org-logo">` : ''}
                    <p class="org-mission">${event.mission_statement || '该组织暂无使命宣言'}</p>
                    <p class="org-contact"><i class="fas fa-envelope"></i> ${event.contact_info}</p>
                </div>
            </div>
        </div>
        
        <div class="event-actions">
            <button id="share-btn" class="btn btn-outline">
                <i class="fas fa-share-alt"></i> 分享活动
            </button>
            <button id="favorite-btn" class="btn btn-outline">
                <i class="far fa-heart"></i> 收藏活动
            </button>
        </div>
    `;
    
    // 绑定按钮事件
    bindEventButtons(event);
}

// 绑定活动按钮事件
function bindEventButtons(event) {
    // 注册按钮
    document.getElementById('register-btn').addEventListener('click', function() {
        alert(`感谢您注册参加 "${event.event_name}"！\n我们已收到您的注册信息，活动详情将通过邮件发送给您。`);
    });
    
    // 捐款按钮
    document.getElementById('donate-btn').addEventListener('click', function() {
        const amount = prompt(`感谢您为 "${event.event_name}" 捐款！\n请输入捐款金额（元）:`);
        if (amount && !isNaN(amount) && amount > 0) {
            alert(`感谢您捐款 ¥${amount}！\n您的支持将帮助 ${event.org_name} 继续他们的重要工作。`);
        }
    });
    
    // 分享按钮
    document.getElementById('share-btn').addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: event.event_name,
                text: event.description,
                url: window.location.href
            });
        } else {
            alert('活动链接已复制到剪贴板！\n' + window.location.href);
        }
    });
    
    // 收藏按钮
    const favoriteBtn = document.getElementById('favorite-btn');
    favoriteBtn.addEventListener('click', function() {
        const isFavorited = favoriteBtn.classList.contains('favorited');
        if (isFavorited) {
            favoriteBtn.classList.remove('favorited');
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i> 收藏活动';
            alert('已从收藏中移除');
        } else {
            favoriteBtn.classList.add('favorited');
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> 已收藏';
            alert('活动已添加到收藏！');
        }
    });
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
            day: 'numeric',
            weekday: 'long'
        });
    } catch (error) {
        console.error('日期格式化错误:', error);
        return '日期待定';
    }
}