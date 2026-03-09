from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Listen for console events
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
        
        print("Navigate to http://localhost:5173")
        page.goto('http://localhost:5173')
        page.wait_for_load_state('networkidle')
        
        print(f"Page title: {page.title()}")
        print(f"Body content length: {len(page.content())}")
        
        screenshot_path = 'c:\\Users\\taras\\.gemini\\antigravity\\brain\\feee0f3e-bede-42a0-8b3f-04869ac65b88\\hero-screenshot-2.png'
        page.screenshot(path=screenshot_path)
        print(f"Saved screenshot to {screenshot_path}")
        
        browser.close()

if __name__ == '__main__':
    run()
