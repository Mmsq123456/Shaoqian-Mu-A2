import { renderNavigation } from './nav.js';

// 渲染导航栏
document.addEventListener('DOMContentLoaded', async function() {
    const navbar = document.getElementById('navbar');
    navbar.appendChild(renderNavigation());
    
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
    
    eventLoader.style.display = 'none';
    eventContainer.style.display = 'block';
    
    // 计算进度百分比
    const progress = event.raised_amount / event.goal_amount * 100;
    const progressBarWidth = `${Math.min(100, progress)}%`;
    
    eventContainer.innerHTML = `
        <div class="event-header">
            <img src="${event.image_url || 'https://via.placeholder.com/800x400?text=Event+Image'}" alt="${event.event_name}" class="event-banner">
            <div class="event-meta">
                <h2>${event.event_name}</h2>
                <p><i class="far fa-calendar"></i> ${formatDate(event.event_date)} ${event.event_time || ''}</p>
                <p><i class="far fa-map-marker-alt"></i> ${event.location}</p>
                <p><i class="far fa-tag"></i> ${event.category_name}</p>
                <p><i class="far fa-building"></i> 主办方: ${event.org_name}</p>
            </div>
        </div>
        
        <div class="event-content">
            <div class="event-description">
                <h3>活动描述</h3>
                <p>${event.description}</p>
            </div>
            
            <div class="event-fundraising">
                <h3>筹款目标</h3>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${progressBarWidth}"></div>
                </div>
                <div class="progress-metrics">
                    <span class="raised-amount">已筹集: ${event.raised_amount.toFixed(2)} 元</span>
                    <span class="goal-amount">目标: ${event.goal_amount.toFixed(2)} 元</span>
                    <span class="progress-percent">进度: ${progress.toFixed(1)}%</span>
                </div>
            </div>
            
            <div class="event-ticket">
                <h3>票务信息</h3>
                <p>${event.ticket_price > 0 ? `票价: ${event.ticket_price} 元` : '免费参加'}</p>
                <button id="register-btn" class="btn btn-primary">立即注册</button>
            </div>
            
            <div class="event-organization">
                <h3>关于主办方</h3>
                <p>${event.mission_statement || '该组织暂无使命宣言'}</p>
                <p><i class="far fa-envelope"></i> ${event.contact_info}</p>
            </div>
        </div>
    `;
    
    // 绑定注册按钮事件
    document.getElementById('register-btn').addEventListener('click', function() {
        alert('此功能正在开发中');
    });
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