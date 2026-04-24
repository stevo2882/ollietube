import { test, expect } from '@playwright/test'
import { gotoWatch } from './helpers'

test.describe('Watch page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('clicking a video card navigates to watch page', async ({ page }) => {
    await gotoWatch(page)
    await expect(page).toHaveURL(/\/watch\/\d+/)
  })

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

  test('like button decrements when unliked', async ({ page }) => {
    await gotoWatch(page)
    const likeBtn = page.locator('button', { hasText: '👍' })
    await likeBtn.click()
    await expect(likeBtn).toContainText('1')
    await likeBtn.click()
    await expect(likeBtn).toContainText('0')
  })

  test('view count increments on visit', async ({ page }) => {
    await gotoWatch(page)
    await expect(page.getByText(/1 views/)).toBeVisible()
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

  test('related video click navigates to that video', async ({ page }) => {
    await gotoWatch(page)
    const firstRelated = page.locator('[class*="lg:w-72"] > div').first()
    await expect(firstRelated).toBeVisible({ timeout: 10000 })
    const currentUrl = page.url()
    await firstRelated.click({ force: true })
    await expect(page).toHaveURL(/\/watch\/\d+/, { timeout: 10000 })
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
    expect(page.url()).not.toBe(currentUrl)
  })

  test('edit modal saves description', async ({ page }) => {
    await gotoWatch(page)
    await page.getByText('✎ Edit').click()
    await expect(page.getByText('Edit video info')).toBeVisible()
    await page.getByLabel('Description').fill('A test description')
    await page.getByText('Save').click()
    await expect(page.getByText('A test description')).toBeVisible({ timeout: 5000 })
  })
})