# Frontend Testing Suite

This testing suite uses Selenium and pytest for automated testing of the application's intro page.

## Requirements

- Python 3.8+
- One or more browsers: Chrome/Chromium, Firefox, Edge, or Safari (macOS only)
- Corresponding WebDriver (ChromeDriver, GeckoDriver, EdgeDriver, or SafariDriver)
  - Or use webdriver-manager for automatic driver management
  - Note: Safari requires enabling "Allow Remote Automation" in Develop menu

## Installation

1. Install the required Python packages:
```
cd frontend\tests
pip install -r requirements.txt
```

2. Make sure you have at least one supported browser installed (Chrome, Firefox, Edge, or Safari).

3. **For Safari users (macOS only):**
   - Enable the Develop menu: Safari → Settings... → Advanced → Show features for web developers
   - Enable automation: Safari → Settings... → Developer → Allow Remote Automation
   - Run once: `safaridriver --enable` in Terminal

## Running Tests

### Prerequisites
The application must be running on `http://localhost:5173` (or update `base_url` in `conftest.py`).

Start the frontend development server:
```
cd frontend
npm run dev
```

### Run all tests
```
cd frontend\tests
pytest -v
```

### Choose browser
You can specify which browser to use (default is Chrome):
```
# Chrome (default)
pytest -v --browser=chrome

# Firefox
pytest -v --browser=firefox

# Edge
pytest -v --browser=edge

# Safari (macOS only)
pytest -v --browser=safari
```

### Run in headless mode
```
pytest -v --headless

# Combine with browser selection (Safari does not support headless)
pytest -v --browser=firefox --headless
```

### Run tests from a specific file
```
pytest test_intro_page.py -v --browser=edge
```

### Run a specific test class
```
pytest test_intro_page.py::TestIntroPageContent -v --headless
```

### Run a specific test
```
pytest test_cta_buttons.py::TestCTAButtons::test_go_to_app_button -v
```
