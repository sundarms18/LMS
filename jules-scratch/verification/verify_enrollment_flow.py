from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Log in
        page.goto("http://localhost:5173/login")
        page.get_by_label("Email").fill("testuser@example.com")
        page.get_by_label("Password").fill("password")
        page.get_by_role("button", name="Login").click()

        # Wait for navigation to the dashboard
        expect(page).to_have_url("http://localhost:5173/dashboard")

        # Go to the enrollment page
        page.get_by_role("link", name="Enroll in a new Course").click()
        expect(page).to_have_url("http://localhost:5173/enroll")

        # Wait for courses to load
        expect(page.get_by_text("Enroll in a Course")).to_be_visible()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/enrollment-page.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)