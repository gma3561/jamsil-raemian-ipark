// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Skip if href is just "#"
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Nav active highlighting on scroll - removed since nav items were deleted

// Chatbot popup close button
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            const popup = document.querySelector('.chatbot-popup');
            if (popup) {
                popup.style.display = 'none';
            }
        });
    }
});

// ChannelTalk open helpers
function openChannelTalk() {
    try {
        if (window.ChannelIO) {
            window.ChannelIO('show');
            window.ChannelIO('openChat');
            return;
        }
    } catch (e) {}
    alert('상담 채널을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
}

// Bind all CTA triggers to ChannelTalk
document.querySelectorAll('.js-open-channel').forEach(el => {
    el.addEventListener('click', function (e) {
        e.preventDefault();
        openChannelTalk();
    });
});

// (폼 삭제됨) - 폼 관련 로직 제거

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', function() {
    const header = document.querySelector('.luxury-header');
    const currentScroll = window.pageYOffset;
    
    if (header) {
        if (currentScroll > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
            header.style.backdropFilter = 'blur(30px)';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.15)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.85)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        }
    }
    
    lastScroll = currentScroll;
});

// (폼 삭제됨) - 전화번호 포맷팅 로직 제거

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements (expand targets for galleries/full images/visual)
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.info-item, .contact-wrapper > *, .gallery-grid img, .full-image, .visual-content');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // Support both old and new navigation classes
    const tabItems = document.querySelectorAll('.tab-item, .nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    console.log('Tab items found:', tabItems.length);
    console.log('Tab panes found:', tabPanes.length);
    
    // Function to show specific tab
    function showTab(tabId) {
        console.log('Switching to tab:', tabId);
        
        // Hide all tab panes
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
        });
        
        // Remove active class from all tab items
        tabItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected tab pane
        const targetPane = document.getElementById(tabId);
        if (targetPane) {
            targetPane.classList.add('active');
            console.log('Tab pane activated:', tabId);
            
            // Scroll to top of the page
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            console.error('Tab pane not found:', tabId);
        }
        
        // Add active class to clicked tab item
        const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }
    
    // Add click event listeners to tab items
    tabItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            console.log('Tab clicked:', tabId);
            showTab(tabId);
        });
    });
    
    // Initialize first tab as active
    if (tabItems.length > 0) {
        showTab('overview');
    }
});
