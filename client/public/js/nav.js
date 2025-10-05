function renderNavigation() {
    const navContainer = document.createElement('nav');
    navContainer.className = 'navbar';
    navContainer.innerHTML = `
        <div class="container">
            <a href="index.html" class="logo">Charity Events</a>
            <ul class="nav-links">
                <li><a href="index.html">首页</a></li>
                <li><a href="search.html">搜索活动</a></li>
                <li><a href="#about">关于我们</a></li>
                <li><a href="#contact">联系我们</a></li>
            </ul>
        </div>
    `;
    return navContainer;
}

// 导出函数
export { renderNavigation };