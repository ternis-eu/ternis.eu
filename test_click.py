from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('http://localhost:3000')

    # Wait for cards to render
    page.wait_for_selector('.person-card')

    # Check bounding boxes of the first card's links
    link = page.locator('.person-card').nth(0).locator('.link-item').nth(0)
    box = link.bounding_box()
    print("Link bounding box:", box)

    # Attempt to click the first card
    card = page.locator('.person-card').nth(0)
    card.click()

    # Give it a second to see if a new tab opened
    page.wait_for_timeout(1000)
    print("Open contexts:", len(browser.contexts))

    # We can't easily check for new tab in simple sync mode without extra setup, but if no error is thrown on click, it means it's clickable.

    page.screenshot(path="card_clickable.png")
    browser.close()
