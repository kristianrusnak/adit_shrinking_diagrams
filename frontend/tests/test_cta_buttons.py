"""
Tests for CTA (Call-to-Action) buttons
Tests "Go to app", "Log in", and "Register" buttons
"""
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


class TestCTAButtons:
    """Test suite for CTA buttons functionality"""
    
    def test_go_to_app_button(self, driver, base_url):
        """Test 'Go to app' CTA button functionality"""
        driver.get(base_url)
        
        time.sleep(2) 
        
        go_to_app_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(text(), 'Go to App')] | //a[contains(text(), 'Go to App')]")
            )
        )
        
        assert go_to_app_button.is_displayed()
        go_to_app_button.click()
        
        WebDriverWait(driver, 10).until(
            EC.url_contains("/app")
        )
        
        assert "/app" in driver.current_url
        
    def test_login_button_exists(self, driver, base_url):
        """Test 'Log in' button exists and is clickable"""
        driver.get(base_url)
        
        time.sleep(2)
        
        login_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
            (By.XPATH, "//a[contains(text(), 'Log in')]")
            )
        )
        
        assert login_button is not None
        
    def test_register_button_exists(self, driver, base_url):
        """Test 'Register'/'Sign up' button exists"""
        driver.get(base_url)
        
        time.sleep(2)
        
        register_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, "//a[contains(text(), 'Register')]")
            )
        )
        
        assert register_button is not None
