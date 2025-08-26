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

// Form Modal Functions
const formModal = document.getElementById('formModal');
const formTitle = document.getElementById('formTitle');
const formDescription = document.getElementById('formDescription');
const inquiryFields = document.getElementById('inquiryFields');
const propertyFields = document.getElementById('propertyFields');

// Form type messages
const formMessages = {
    inquiry: {
        title: '시세 문의',
        description: '연락처/거래형태(매매,전세,월세)/평형 알려주시면 잠실 래미안아이파크 담당자가 빠르게 연락드리겠습니다.'
    },
    property: {
        title: '매물 접수',
        description: '연락처/동호수 남겨주시면 연락드리겠습니다.'
    }
};

// Open form modal
function openFormModal(type) {
    const config = formMessages[type];
    if (!config) return;
    
    formTitle.textContent = config.title;
    formDescription.textContent = config.description;
    
    // Show/hide conditional fields
    if (type === 'inquiry') {
        inquiryFields.style.display = 'flex';
        propertyFields.style.display = 'none';
    } else {
        inquiryFields.style.display = 'none';
        propertyFields.style.display = 'flex';
    }
    
    formModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close form modal
function closeFormModal() {
    formModal.classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('contactForm').reset();
}

// Bind hero buttons to form modal
document.querySelectorAll('.hero-btn[data-form-type]').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const formType = this.getAttribute('data-form-type');
        openFormModal(formType);
    });
});

// Close button
document.querySelector('.form-close-btn').addEventListener('click', closeFormModal);

// Close on outside click
formModal.addEventListener('click', function(e) {
    if (e.target === formModal) {
        closeFormModal();
    }
});

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Determine form type
    const formType = inquiryFields.style.display !== 'none' ? '시세 문의' : '매물 접수';
    
    // Format message for Slack
    let message = `*🏢 잠실 래미안아이파크 - ${formType}*\n\n`;
    message += `• 성함: ${data.name}\n`;
    message += `• 전화번호: ${data.phone}\n`;
    
    if (formType === '시세 문의') {
        message += `• 거래형태: ${data.dealType || '미선택'}\n`;
        message += `• 평형: ${data.area || '미입력'}\n`;
    } else {
        message += `• 동호수: ${data.dongho || '미입력'}\n`;
    }
    
    if (data.message) {
        message += `• 문의사항: ${data.message}\n`;
    }
    
    message += `\n_${new Date().toLocaleString('ko-KR')}_`;
    
    // Slack Webhook URL - 실제 사용시 여기에 슬랙 Webhook URL을 넣어주세요
    const SLACK_WEBHOOK_URL = 'YOUR_SLACK_WEBHOOK_URL_HERE';
    
    try {
        // 실제 운영시에는 이 부분의 주석을 해제하고 위의 SLACK_WEBHOOK_URL에 실제 URL을 넣어주세요
        /*
        const response = await fetch(SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: message
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to send to Slack');
        }
        */
        
        // 임시로 콘솔에 출력 (실제 운영시 제거)
        console.log('Slack message:', message);
        console.log('Form data:', data);
        
        // Show success message
        alert('문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
        
        // Close modal
        closeFormModal();
        
    } catch (error) {
        console.error('Error sending to Slack:', error);
        alert('문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
});

// Update remaining js-open-channel buttons
document.querySelectorAll('.js-open-channel').forEach(el => {
    el.addEventListener('click', function (e) {
        e.preventDefault();
        // Default to inquiry form for other buttons
        openFormModal('inquiry');
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
