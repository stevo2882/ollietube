import { test, expect } from '@playwright/test'
import { waitForVideoGrid } from './helpers'

test.describe('Home page', () => {
  test('loads and displays the navbar', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('OllieTube')).toBeVisible()
    await expect(page.getByPlaceholder('Search')).toBeVisible()
  })

  test('displays video cards', async ({ page }) => {
    await page.goto('/')
    await waitForVideoGrid(page)
    const count = await page.locator('.grid > div').count()
    expect(count).toBeGreaterThan(0)
  })

  test('skeleton loaders appear before videos load', async ({ page }) => {
    // Intercept the API to delay response
    await page.route('http://localhost:3001/api/videos', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      await route.continue()
    })
    await page.goto('/')
    await expect(page.locator('.animate-pulse').first()).toBeVisible()
  })

  test('search filters the video grid', async ({ page }) => {
    await page.goto('/')
    await waitForVideoGrid(page)
    await page.getByPlaceholder('Search').fill('zzznomatch')
    await expect(page.getByText(/No results for/)).toBeVisible()
    await page.getByPlaceholder('Search').fill('')
    await expect(page.locator('.grid > div').first()).toBeVisible({ timeout: 5000 })
  })

  test('clearing search restores videos', async ({ page }) => {
    await page.goto('/')
    await waitForVideoGrid(page)
    const totalBefore = await page.locator('.grid > div').count()
    await page.getByPlaceholder('Search').fill('zzznomatch')
    await expect(page.getByText(/No results for/)).toBeVisible()
    await page.getByPlaceholder('Search').fill('')
    await waitForVideoGrid(page)
    const totalAfter = await page.locator('.grid > div').count()
    expect(totalAfter).toBe(totalBefore)
  })

  test('sidebar shows nav items', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Home')).toBeVisible()
    await expect(page.getByText('Trending')).toBeVisible()
    await expect(page.getByText('Subscriptions')).toBeVisible()
    await expect(page.getByText('Library')).toBeVisible()
  })

  test('sidebar history is empty on first visit', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('History')).not.toBeVisible()
  })

  test('sidebar history item navigates to watch page', async ({ page }) => {
    await page.goto('/')
    await waitForVideoGrid(page)

    // Watch a video first
    await page.locator('.grid > div').first().click()
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })

    // Go back home
    await page.goto('/')
    await expect(page.getByText('History')).toBeVisible({ timeout: 5000 })

    // Click the history item
    const historyItem = page.locator('button', { hasText: '🕑' }).first()
    await historyItem.click()
    await expect(page).toHaveURL(/\/watch\/\d+/, { timeout: 10000 })
  })

  test('clearing history removes it from sidebar', async ({ page }) => {
    await page.goto('/')
    await waitForVideoGrid(page)

    // Watch a video to build history
    await page.locator('.grid > div').first().click()
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
    await page.goto('/')

    // Verify history appears then clear it
    await expect(page.getByText('History')).toBeVisible({ timeout: 5000 })
    await page.getByText('Clear').click()
    await expect(page.getByText('History')).not.toBeVisible()
  })
})