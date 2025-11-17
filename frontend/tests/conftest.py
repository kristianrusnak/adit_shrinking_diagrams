"""
Pytest configuration and shared fixtures
"""
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.safari.options import Options as SafariOptions


def pytest_addoption(parser):
    """Add custom command line options"""
    parser.addoption(
        "--browser",
        action="store",
        default="chrome",
        help="Browser to use for tests: chrome, firefox, edge, safari"
    )
    parser.addoption(
        "--headless",
        action="store_true",
        default=False,
        help="Run browser in headless mode (not supported for Safari)"
    )


@pytest.fixture(scope="module")
def browser_type(request):
    """Get browser type from command line"""
    return request.config.getoption("--browser")


@pytest.fixture(scope="module")
def headless_mode(request):
    """Get headless mode from command line"""
    return request.config.getoption("--headless")


@pytest.fixture(scope="module")
def driver(browser_type, headless_mode):
    """Initialize WebDriver based on browser selection"""
    
    if browser_type.lower() == "chrome":
        chrome_options = Options()
        if headless_mode:
            chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--start-maximized")
        driver = webdriver.Chrome(options=chrome_options)
        
    elif browser_type.lower() == "firefox":
        firefox_options = FirefoxOptions()
        if headless_mode:
            firefox_options.add_argument("--headless")
        driver = webdriver.Firefox(options=firefox_options)
        
    elif browser_type.lower() == "edge":
        edge_options = EdgeOptions()
        if headless_mode:
            edge_options.add_argument("--headless")
        edge_options.add_argument("--no-sandbox")
        edge_options.add_argument("--disable-dev-shm-usage")
        driver = webdriver.Edge(options=edge_options)
        
    elif browser_type.lower() == "safari":
        safari_options = SafariOptions()
        if headless_mode:
            print("Warning: Safari does not support headless mode. Running in normal mode.")
        driver = webdriver.Safari(options=safari_options)
        
    else:
        raise ValueError(f"Unsupported browser: {browser_type}. Use chrome, firefox, edge, or safari.")
    
    driver.implicitly_wait(10)
    
    yield driver
    
    driver.quit()


@pytest.fixture(scope="module")
def base_url():
    """Base URL for testing"""
    return "http://localhost:5173"

