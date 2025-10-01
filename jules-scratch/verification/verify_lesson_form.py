import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        try:
            # Step 1: Log in as admin
            await page.goto("http://localhost:5173/login")
            await page.get_by_label("Email Address").fill("admin@test.com")
            await page.get_by_label("Password").fill("password")
            await page.get_by_role("button", name="Login").click()
            await expect(page.get_by_text("Admin Dashboard")).to_be_visible()

            # Step 2: Navigate to the courses tab and then to a course
            await page.get_by_role("button", name="Courses").click()
            # Click the first course in the list to view details
            await page.get_by_role("row").nth(1).get_by_role("link").first.click()
            await expect(page.get_by_text("Course Content")).to_be_visible()

            # Step 3: Open the lesson form
            # Click to expand the first module's lessons
            await page.get_by_role("button", name=/Lessons for/).click()
            # Click "Add Lesson"
            await page.get_by_role("button", name="Add Lesson").click()
            await expect(page.get_by_text("Create New Lesson")).to_be_visible()

            # Step 4: Verify conditional field for "video" type
            await page.get_by_label("Type").select_option("video")
            await expect(page.get_by_label("YouTube Video ID")).to_be_visible()
            await expect(page.get_by_label("Content")).not_to_be_visible()

            # Step 5: Verify conditional field for "text" type
            await page.get_by_label("Type").select_option("text")
            await expect(page.get_by_label("YouTube Video ID")).not_to_be_visible()
            await expect(page.get_by_label("Content")).to_be_visible()

            # Step 6: Take a screenshot
            await page.screenshot(path="jules-scratch/verification/verification.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path="jules-scratch/verification/error.png")

        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())