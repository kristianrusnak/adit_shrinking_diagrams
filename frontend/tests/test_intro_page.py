"""
Tests for the intro/landing page (/)
Tests explanations and basic page functionality
"""
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


class TestIntroPageContent:
    """Test suite for intro page content and explanations"""
    
    def test_page_loads(self, driver, base_url):
        """Test if the intro page loads successfully"""
        driver.get(base_url)
        
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        assert "Shrinking Diagrams" in driver.title
        
    def test_shrinking_diagrams_explanation(self, driver, base_url):
        """Test if page explains what 'shrinking diagrams' means"""
        driver.get(f"{base_url}/about")
        
        heading = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'What is Shrinking Diagrams')]")
            )
        )
        
        assert heading.is_displayed()

        page_text = driver.find_element(By.TAG_NAME, "body").text
        assert page_text is not None and len(page_text) > 0
   
    def test_algorithms_explanation(self, driver, base_url):
        """Test if page explains available algorithms"""
        driver.get(f"{base_url}/docs")
        
        heading = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, "//h2[contains(text(), 'Available Algorithms')]")
            )
        )
        
        assert heading.is_displayed()
        
        page_text = driver.find_element(By.TAG_NAME, "body").text
        assert page_text is not None and len(page_text) > 0
