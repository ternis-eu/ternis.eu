from playwright.sync_api import sync_playwright
import time
import os

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('http://localhost:3000')

    # Wait for cards to render
    page.wait_for_selector('.person-card')
    time.sleep(1) # wait for animation

    os.makedirs('screenshots', exist_ok=True)
    page.screenshot(path="screenshots/ui_update.png", full_page=True)
    browser.close()
