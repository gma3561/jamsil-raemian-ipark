// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션 스크롤 효과
    initNavigationScroll();
    
    // 스무스 스크롤
    initSmoothScroll();
    
    // 폼 제출 처리
    initContactForm();
    
    // 애니메이션 효과
    initAnimations();
    
    // 스크롤 인디케이터 클릭 이벤트
    initScrollIndicator();
});

// 네비게이션 스크롤 효과
function initNavigationScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// 스무스 스크롤
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // 네비게이션 높이만큼 조정
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 문의 폼 처리
function initContactForm() {
    const form = document.getElementById('inquiryForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            // 간단한 유효성 검사
            if (!data.name || !data.phone) {
                showNotification('이름과 연락처는 필수 입력 항목입니다.', 'error');
                return;
            }
            
            // 성공 메시지 표시
            showNotification('문의가 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.', 'success');
            
            // 폼 초기화
            form.reset();
            
            // 콘솔에 데이터 출력 (실제로는 서버로 전송)
            console.log('문의 데이터:', data);
        });
    }
}

// 알림 메시지 표시
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 알림 요소 생성
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // 스타일 추가
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // 닫기 버튼 스타일
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 1rem;
        padding: 0;
    `;
    
    // 닫기 버튼 이벤트
    closeBtn.addEventListener('click', function() {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // DOM에 추가
    document.body.appendChild(notification);
    
    // 애니메이션 표시
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 자동 제거 (5초 후)
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// 애니메이션 효과
function initAnimations() {
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
    
    // 애니메이션 대상 요소들
    const animatedElements = document.querySelectorAll('.feature-card, .info-card, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 스크롤 인디케이터 클릭 이벤트
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const featuresSection = document.querySelector('#features');
            if (featuresSection) {
                const offsetTop = featuresSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// 문의하기 버튼 클릭 시 문의 섹션으로 스크롤
function scrollToContact() {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        const offsetTop = contactSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// 자세히 보기 버튼 클릭 시 특징 섹션으로 스크롤
function scrollToFeatures() {
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
        const offsetTop = featuresSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// 전화번호 클릭 시 전화 앱 실행
function makePhoneCall(phoneNumber) {
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = `tel:${phoneNumber}`;
    } else {
        // 데스크톱에서는 클립보드에 복사
        navigator.clipboard.writeText(phoneNumber).then(function() {
            showNotification('전화번호가 클립보드에 복사되었습니다.', 'success');
        }).catch(function() {
            showNotification('전화번호 복사에 실패했습니다.', 'error');
        });
    }
}

// 전화번호 클릭 이벤트 추가
document.addEventListener('DOMContentLoaded', function() {
    const phoneElements = document.querySelectorAll('.nav-contact span, .contact-item p');
    
    phoneElements.forEach(element => {
        if (element.textContent.includes('1588-3588')) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', function() {
                makePhoneCall('1588-3588');
            });
        }
    });
});

// 페이지 로딩 완료 후 추가 초기화
window.addEventListener('load', function() {
    // 이미지 로딩 완료 후 애니메이션 시작
    const heroImage = document.querySelector('.hero-bg-img');
    if (heroImage) {
        heroImage.addEventListener('load', function() {
            document.body.classList.add('page-loaded');
        });
    }
    
    // 페이지 로딩 상태 표시
    document.body.classList.add('page-loaded');
});

// 스크롤 진행률 표시 (선택사항)
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #3498db, #2980b9);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// 스크롤 진행률 초기화 (선택사항)
// initScrollProgress();
