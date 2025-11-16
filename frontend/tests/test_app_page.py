"""
Tests for the app page (/app)
Tests that the app page is separate and different from intro
"""
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestAppPage:
    """Test suite for the app page (/app)"""
    
    def test_app_page_loads(self, driver, base_url):
        """Test if the app page loads successfully"""
        driver.get(f"{base_url}/app")
        
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        assert "/app" in driver.current_url
        
    def test_app_page_different_from_intro(self, driver, base_url):
        """Test that app page content is different from intro page"""
        driver.get(base_url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        intro_content = driver.find_element(By.TAG_NAME, "body").text
        
        driver.get(f"{base_url}/app")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        app_content = driver.find_element(By.TAG_NAME, "body").text
        
        assert intro_content != app_content
        
    def test_app_page_is_functional_route(self, driver, base_url):
        """Test that /app is a valid functional route"""
        driver.get(f"{base_url}/app")
        
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        page_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        assert "404" not in page_text
        assert "not found" not in page_text
