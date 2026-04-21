import { test, expect } from '@playwright/test'

test.describe('Watch page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home and wait for videos to load
    await page.goto('/')
    await expect(page.locator('.grid > div').first()).toBeVisible({ timeout: 5000 })
  })

  test('clicking a video card navigates to watch page', async ({ page }) => {
    await page.locator('.grid > div').first().click()
    await expect(page).toHaveURL(/\/watch\/\d+/)
  })

  test('watch page shows video title', async ({ page }) => {
    await page.locator('.grid > div').first().click()
    await expect(page).toHaveURL(/\/watch\/\d+/)
    await expect(page.locator('h1')).toBeVisible()
    const title = await page.locator('h1').textContent()
    expect(title?.length).toBeGreaterThan(0)
  })

  test('watch page shows video player', async ({ page }) => {
    await page.locator('.grid > div').first().click()
    await expect(page.locator('video')).toBeVisible()
  })

  test('watch page shows related videos sidebar', async ({ page }) => {
    await page.locator('.grid > div').first().click()
    await expect(page.getByText('Up next')).toBeVisible()
  })

  test('like button toggles state', async ({ page }) => {
    await page.locator('.grid > div').first().click()
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
    const likeBtn = page.locator('button', { hasText: '👍' })
    await expect(likeBtn).toBeVisible()
    await likeBtn.click()
    await expect(likeBtn).toContainText('1')
  })

  test('back to home button navigates home', async ({ page }) => {
    await page.locator('.grid > div').first().click()
    await page.getByText('← Back to home').click()
    await expect(page).toHaveURL('/')
  })

  test('watch history appears in sidebar after watching', async ({ page }) => {
    await page.locator('.grid > div').first().click()
    await expect(page).toHaveURL(/\/watch\/\d+/)
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
    await page.goto('/')
    await expect(page.getByText('History')).toBeVisible({ timeout: 5000 })
  })
})