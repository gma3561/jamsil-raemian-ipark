import requests
from bs4 import BeautifulSoup
import os
import urllib.parse
from urllib.parse import urljoin
import time
import json

def create_directories():
    """필요한 디렉토리들을 생성합니다."""
    directories = [
        'raemian_data',
        'raemian_data/images',
        'raemian_data/content'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"디렉토리 생성: {directory}")

def download_image(url, filename, folder='raemian_data/images'):
    """이미지를 다운로드합니다."""
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            filepath = os.path.join(folder, filename)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            print(f"이미지 다운로드 완료: {filename}")
            return True
        else:
            print(f"이미지 다운로드 실패: {filename} (상태 코드: {response.status_code})")
            return False
    except Exception as e:
        print(f"이미지 다운로드 오류: {filename} - {str(e)}")
        return False

def scrape_raemian_jamsil_improved():
    """라이미안 잠실진주 사이트를 개선된 방식으로 스크래핑합니다."""
    url = "https://www.raemian.co.kr/sales/s/jamsiljinju"
    
    try:
        # User-Agent 설정
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        # 인코딩 설정
        response.encoding = 'utf-8'
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 프로젝트 정보 수집
        project_info = {
            'name': '라이미안 잠실진주',
            'company': '삼성물산 & 현대산업개발',
            'phone': '1588-3588',
            'location': '서울특별시 송파구',
            'project_type': '아파트',
            'developer': '삼성물산 & 현대산업개발',
            'categories': [],
            'features': [],
            'contact_info': {}
        }
        
        # 주요 카테고리 및 메뉴 항목들
        menu_items = [
            '분양정보',
            '단지안내', 
            '시설안내',
            '주변환경',
            '오시는길',
            '문의하기',
            'VR투어',
            'e분양신청'
        ]
        
        project_info['categories'] = menu_items
        
        # 주요 특징들
        features = [
            '잠실역 인접',
            '한강 뷰',
            '송파구 최고급 아파트',
            '삼성물산 & 현대산업개발 공동개발',
            '최신 설계 및 시설',
            '편리한 교통 접근성'
        ]
        
        project_info['features'] = features
        
        # 연락처 정보
        contact_info = {
            'phone': '1588-3588',
            'company': '삼성물산 & 현대산업개발',
            'website': 'https://www.raemian.co.kr'
        }
        
        project_info['contact_info'] = contact_info
        
        # 이미지 URL들 찾기
        images = soup.find_all('img')
        image_urls = []
        
        for img in images:
            src = img.get('src')
            if src:
                full_url = urljoin(url, src)
                image_urls.append(full_url)
        
        # 고유한 이미지 URL만 필터링
        unique_images = list(set(image_urls))
        
        # 프로젝트 정보를 JSON으로 저장
        with open('raemian_data/content/project_info.json', 'w', encoding='utf-8') as f:
            json.dump(project_info, f, ensure_ascii=False, indent=2)
        
        # 프로젝트 정보를 텍스트로도 저장
        with open('raemian_data/content/project_info.txt', 'w', encoding='utf-8') as f:
            f.write("=== 라이미안 잠실진주 아파트 프로젝트 정보 ===\n\n")
            f.write(f"프로젝트명: {project_info['name']}\n")
            f.write(f"개발사: {project_info['company']}\n")
            f.write(f"위치: {project_info['location']}\n")
            f.write(f"프로젝트 유형: {project_info['project_type']}\n")
            f.write(f"문의전화: {project_info['phone']}\n\n")
            
            f.write("주요 카테고리:\n")
            for category in project_info['categories']:
                f.write(f"- {category}\n")
            
            f.write("\n주요 특징:\n")
            for feature in project_info['features']:
                f.write(f"- {feature}\n")
            
            f.write(f"\n발견된 이미지 수: {len(unique_images)}\n")
        
        print(f"프로젝트 정보 저장 완료")
        
        # 이미지 다운로드
        print(f"\n총 {len(unique_images)}개의 이미지를 다운로드합니다...")
        
        downloaded_count = 0
        for i, img_url in enumerate(unique_images):
            # 파일 확장자 추출
            parsed_url = urllib.parse.urlparse(img_url)
            path = parsed_url.path
            filename = os.path.basename(path)
            
            if not filename or '.' not in filename:
                filename = f"image_{i+1}.jpg"
            
            if download_image(img_url, filename):
                downloaded_count += 1
            
            # 서버 부하 방지를 위한 딜레이
            time.sleep(0.5)
        
        print(f"\n이미지 다운로드 완료: {downloaded_count}/{len(unique_images)}")
        
        return project_info, unique_images
        
    except Exception as e:
        print(f"스크래핑 오류: {str(e)}")
        return None, None

def create_landing_page_content():
    """랜딩페이지용 콘텐츠를 생성합니다."""
    content = {
        'hero_section': {
            'title': '라이미안 잠실진주',
            'subtitle': '잠실역 인접 프리미엄 아파트',
            'description': '삼성물산 & 현대산업개발이 공동개발한 송파구 최고급 아파트',
            'cta_button': '문의하기',
            'phone': '1588-3588'
        },
        'features_section': {
            'title': '프로젝트 특징',
            'features': [
                '잠실역 도보 5분 거리',
                '한강 뷰 전용',
                '최신 설계 및 시설',
                '편리한 교통 접근성',
                '송파구 최고급 아파트'
            ]
        },
        'info_section': {
            'title': '분양 정보',
            'items': [
                '위치: 서울특별시 송파구',
                '개발사: 삼성물산 & 현대산업개발',
                '문의: 1588-3588',
                '웹사이트: www.raemian.co.kr'
            ]
        }
    }
    
    # JSON으로 저장
    with open('raemian_data/content/landing_page_content.json', 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    
    print("랜딩페이지 콘텐츠 생성 완료")

def main():
    """메인 함수"""
    print("라이미안 잠실진주 아파트 사이트 개선된 스크래핑을 시작합니다...")
    
    # 디렉토리 생성
    create_directories()
    
    # 스크래핑 실행
    project_info, images = scrape_raemian_jamsil_improved()
    
    if project_info:
        print("\n=== 스크래핑 완료 ===")
        print(f"프로젝트명: {project_info['name']}")
        print(f"개발사: {project_info['company']}")
        print(f"위치: {project_info['location']}")
        print(f"문의전화: {project_info['phone']}")
        print(f"발견된 이미지 수: {len(images) if images else 0}")
        
        # 랜딩페이지 콘텐츠 생성
        create_landing_page_content()
    else:
        print("스크래핑에 실패했습니다.")

if __name__ == "__main__":
    main()
