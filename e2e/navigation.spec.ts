import { test, expect } from '@playwright/test'
import { waitForVideoGrid, gotoWatch } from './helpers'

test.describe('Navigation', () => {
  test('direct URL to watch page works', async ({ page }) => {
    await page.goto('/')
    await gotoWatch(page)
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
  })

  test('invalid watch URL shows not found', async ({ page }) => {
    await page.goto('/watch/99999')
    await expect(page.getByText(/Video not found/)).toBeVisible({ timeout: 10000 })
  })

  test('edit modal opens and closes', async ({ page }) => {
    await page.goto('/')
    await gotoWatch(page)
    await page.getByText('✎ Edit').click()
    await expect(page.getByText('Edit video info')).toBeVisible()
    await page.getByText('Cancel').click()
    await expect(page.getByText('Edit video info')).not.toBeVisible()
  })

  test('edit modal saves new title', async ({ page }) => {
    await page.goto('/')
    await gotoWatch(page)
    await page.getByText('✎ Edit').click()
    await expect(page.getByText('Edit video info')).toBeVisible()
    await page.getByLabel('Title').clear()
    await page.getByLabel('Title').fill('My Custom Title')
    await page.getByText('Save').click()
    await expect(page.locator('h1')).toHaveText('My Custom Title', { timeout: 5000 })
  })

  test('clicking OllieTube logo navigates home', async ({ page }) => {
    await page.goto('/')
    await gotoWatch(page)
    await page.getByText('OllieTube').click()
    await expect(page).toHaveURL('http://localhost:5173/')
  })

  test('sidebar Home button navigates home', async ({ page }) => {
    await page.goto('/')
    await gotoWatch(page)
    await page.getByRole('button', { name: /Home/ }).click()
    await expect(page).toHaveURL('http://localhost:5173/')
  })
})