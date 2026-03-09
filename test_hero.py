from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})
        print("Navigate to http://localhost:5173")
        page.goto('http://localhost:5173')
        page.wait_for_load_state('networkidle')
        
        # Take a screenshot
        screenshot_path = 'c:\\Users\\taras\\.gemini\\antigravity\\brain\\feee0f3e-bede-42a0-8b3f-04869ac65b88\\hero-screenshot.png'
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")
        
        # Check for important elements
        navbar = page.locator('nav')
        print(f"Navbar active: {navbar.is_visible()}")
        
        links = page.locator('nav a')
        for i in range(links.count()):
            print(f"Link {i}: {links.nth(i).text_content()}")
            
        hero_title = page.locator('h1')
        print(f"Hero Title: {hero_title.text_content()}")
        
        browser.close()

if __name__ == '__main__':
    run()
