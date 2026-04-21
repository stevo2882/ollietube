import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test('loads and displays the navbar', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('OllieTube')).toBeVisible()
    await expect(page.getByPlaceholder('Search')).toBeVisible()
  })

  test('displays video cards', async ({ page }) => {
    await page.goto('/')
    const cards = page.locator('.grid > div')
    await expect(cards.first()).toBeVisible({ timeout: 5000 })
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('search filters the video grid', async ({ page }) => {
    await page.goto('/')

    // Wait for videos to load
    await expect(page.locator('.grid > div').first()).toBeVisible({ timeout: 5000 })
    const totalBefore = await page.locator('.grid > div').count()

    // Type something unlikely to match all videos
    await page.getByPlaceholder('Search').fill('zzznomatch')
    await expect(page.getByText(/No results for/)).toBeVisible()

    // Clear and verify cards come back
    await page.getByPlaceholder('Search').fill('')
    await expect(page.locator('.grid > div')).toHaveCount(totalBefore)
  })

  test('sidebar shows nav items', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Home')).toBeVisible()
    await expect(page.getByText('Trending')).toBeVisible()
    await expect(page.getByText('History')).not.toBeVisible()
  })
})