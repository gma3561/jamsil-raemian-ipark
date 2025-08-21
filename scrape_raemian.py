import requests
from bs4 import BeautifulSoup
import os
import urllib.parse
from urllib.parse import urljoin
import time

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

def scrape_raemian_jamsil():
    """라이미안 잠실진주 사이트를 스크래핑합니다."""
    url = "https://www.raemian.co.kr/sales/s/jamsiljinju"
    
    try:
        # User-Agent 설정
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        # 인코딩 설정
        response.encoding = 'utf-8'
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 중요한 정보들을 추출
        project_info = {}
        
        # 프로젝트 기본 정보
        project_info['name'] = '라이미안 잠실진주'
        project_info['company'] = '삼성물산 & 현대산업개발'
        project_info['phone'] = '1588-3588'
        
        # 주요 카테고리들
        categories = []
        nav_items = soup.find_all('a', href=True)
        for item in nav_items:
            if item.text.strip():
                categories.append(item.text.strip())
        
        project_info['categories'] = list(set(categories))
        
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
        
        # 정보를 파일로 저장
        with open('raemian_data/content/project_info.txt', 'w', encoding='utf-8') as f:
            f.write("=== 라이미안 잠실진주 아파트 프로젝트 정보 ===\n\n")
            f.write(f"프로젝트명: {project_info['name']}\n")
            f.write(f"개발사: {project_info['company']}\n")
            f.write(f"문의전화: {project_info['phone']}\n\n")
            f.write("주요 카테고리:\n")
            for category in project_info['categories']:
                f.write(f"- {category}\n")
            f.write(f"\n발견된 이미지 수: {len(unique_images)}\n")
        
        print(f"프로젝트 정보 저장 완료: raemian_data/content/project_info.txt")
        
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

def main():
    """메인 함수"""
    print("라이미안 잠실진주 아파트 사이트 스크래핑을 시작합니다...")
    
    # 디렉토리 생성
    create_directories()
    
    # 스크래핑 실행
    project_info, images = scrape_raemian_jamsil()
    
    if project_info:
        print("\n=== 스크래핑 완료 ===")
        print(f"프로젝트명: {project_info['name']}")
        print(f"개발사: {project_info['company']}")
        print(f"문의전화: {project_info['phone']}")
        print(f"발견된 이미지 수: {len(images) if images else 0}")
    else:
        print("스크래핑에 실패했습니다.")

if __name__ == "__main__":
    main()
