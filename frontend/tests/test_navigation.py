"""
Tests for navigation between pages
Tests routing and page separation
"""
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


class TestNavigation:
    """Test suite for navigation and routing"""
    
    def test_intro_separate_from_app_route(self, driver, base_url):
        """Test that intro page (/) is separate from app page (/app)"""
        driver.get(base_url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        intro_url = driver.current_url
        assert intro_url.rstrip('/') == base_url.rstrip('/')
        
        driver.get(f"{base_url}/app")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        app_url = driver.current_url
        
        assert "/app" in app_url
        assert intro_url != app_url
        
    def test_navigation_menu_accessible_on_all_pages(self, driver, base_url):
        """Test that navigation menu is accessible on intro pages"""
        pages = [
            base_url,
            f"{base_url}/about",
            f"{base_url}/docs"
        ]
        
        for page in pages:
            driver.get(page)
            time.sleep(1)
            
            home_link = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, "//div[starts-with(@class, 'card-nav-')]")
                )
            )

            assert home_link.is_displayed(), f"Navigation not found on {page}"
