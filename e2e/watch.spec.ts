import { test, expect, type Page } from '@playwright/test'

async function gotoWatch(page: Page) {
  await page.locator('.grid > div').first().click()
  await expect(page).toHaveURL(/\/watch\/\d+/, { timeout: 10000 })
  await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
}

test.describe('Watch page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for grid and for at least one thumbnail to finish loading
    await expect(page.locator('.grid > div').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.grid img').first()).toBeVisible({ timeout: 15000 })
  })

  test('clicking a video card navigates to watch page', async ({ page }) => {
    await page.locator('.grid > div').first().click()
    await expect(page).toHaveURL(/\/watch\/\d+/, { timeout: 10000 })
  })

  // ... rest of tests unchanged, replace click + wait pattern with gotoWatch
  test('watch page shows video title', async ({ page }) => {
    await gotoWatch(page)
    const title = await page.locator('h1').textContent()
    expect(title?.length).toBeGreaterThan(0)
  })

  test('watch page shows video player', async ({ page }) => {
    await gotoWatch(page)
    await expect(page.locator('video')).toBeVisible()
  })

  test('watch page shows related videos sidebar', async ({ page }) => {
    await gotoWatch(page)
    await expect(page.getByText('Up next')).toBeVisible()
  })

  test('like button toggles state', async ({ page }) => {
    await gotoWatch(page)
    const likeBtn = page.locator('button', { hasText: '👍' })
    await expect(likeBtn).toBeVisible()
    await likeBtn.click()
    await expect(likeBtn).toContainText('1')
  })

  test('back to home button navigates home', async ({ page }) => {
    await gotoWatch(page)
    await page.getByText('← Back to home').click()
    await expect(page).toHaveURL('http://localhost:5173/')
  })

  test('watch history appears in sidebar after watching', async ({ page }) => {
    await gotoWatch(page)
    await page.goto('/')
    await expect(page.getByText('History')).toBeVisible({ timeout: 5000 })
  })
})