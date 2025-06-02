// 等待DOM載入完成
document.addEventListener('DOMContentLoaded', function() {
    
    // 手機版選單功能
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 點擊選單項目後關閉選單
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // 點擊選單外部關閉選單
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // 視窗大小改變時的處理
    window.addEventListener('resize', function() {
        // 如果螢幕變大（超過900px），自動關閉手機選單
        if (window.innerWidth > 900) {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });
    
    // 平滑滾動效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 70; // 導航列高度
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 滾動時導航列效果
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 向下滾動時添加陰影效果
        if (scrollTop > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 滾動時元素動畫效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // 為需要動畫的元素添加觀察
    const animateElements = document.querySelectorAll('.about-card, .service-card, .portfolio-item, .pricing-card, .contact-card');
    animateElements.forEach(element => {
        element.classList.add('scroll-reveal');
        observer.observe(element);
    });
    
    // 卡片懸停效果增強
    const cards = document.querySelectorAll('.about-card, .service-card, .portfolio-item, .pricing-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            this.style.transform = '';
        });
    });
    
    // 電話號碼格式化顯示
    function formatPhoneNumber(phone) {
        // 將 0978603608 格式化為 0978-603-608
        return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1-$2-$3');
    }
    
    // 複製聯絡資訊功能
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('已複製到剪貼簿！', 'success');
        }).catch(err => {
            console.error('複製失敗:', err);
            showNotification('複製失敗，請手動複製', 'error');
        });
    }
    
    // 通知功能
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9999;
            font-weight: 500;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 顯示動畫
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 3秒後移除
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // 添加複製功能到電話號碼
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            
            // 同時撥打電話和複製號碼
            window.location.href = this.getAttribute('href');
            copyToClipboard(phoneNumber);
        });
        
        // 添加右鍵複製功能
        link.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            copyToClipboard(phoneNumber);
        });
    });
    
    // 價格計算器功能
    function calculatePrice(pages, type) {
        let basePrice = 0;
        
        switch(type) {
            case 'static':
                if (pages === 1) {
                    basePrice = 800;
                } else if (pages <= 5) {
                    basePrice = 3500;
                } else if (pages <= 10) {
                    basePrice = 6000;
                } else {
                    basePrice = 6000 + (pages - 10) * 400;
                }
                break;
            case 'cms':
                basePrice = pages <= 5 ? 8000 : 15000;
                break;
            case 'ecommerce':
                basePrice = 25000;
                if (pages > 10) basePrice = 45000;
                break;
        }
        
        return basePrice;
    }
    
    // 滾動到頂部按鈕
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // 滾動時顯示/隱藏回到頂部按鈕
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // 點擊回到頂部
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 懸停效果
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#c0392b';
        this.style.transform = 'scale(1.1)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#e74c3c';
        this.style.transform = 'scale(1)';
    });
    
    // 頁面載入完成動畫
    const heroElements = document.querySelectorAll('.hero-profile > *');
    heroElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // 錯誤處理：圖片載入失敗時的替代方案
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'profile-placeholder';
            placeholder.innerHTML = `
                <div style="
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, #3498db, #e74c3c);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    color: white;
                    border: 5px solid rgba(255,255,255,0.3);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                ">👨‍🎓</div>
            `;
            this.parentNode.insertBefore(placeholder, this);
        });
    }
    
    // 工具函數：格式化價格
    function formatPrice(price) {
        return new Intl.NumberFormat('zh-TW', {
            style: 'currency',
            currency: 'TWD',
            minimumFractionDigits: 0
        }).format(price);
    }
    
    // 全域變數，供其他頁面使用
    window.WebDeveloperService = {
        calculatePrice,
        formatPrice,
        copyToClipboard,
        showNotification,
        formatPhoneNumber
    };
    
    // 控制台歡迎訊息
    console.log(`
    🚀 黃家彥網頁開發服務 
    📞 聯絡電話: 0978-603-608
    🎓 台灣科技大學電子工程系碩士
    💰 超值價格，專業品質！
    `);
    
    console.log('網站已載入完成！歡迎聯絡討論您的專案需求。');
});