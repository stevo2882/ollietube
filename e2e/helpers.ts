import { expect, type Page } from '@playwright/test'

export async function waitForVideoGrid(page: Page) {
  await expect(page.locator('.grid > div').first()).toBeVisible({ timeout: 10000 })
  await expect(page.locator('.grid img').first()).toBeVisible({ timeout: 15000 })
}

export async function gotoWatch(page: Page) {
  await waitForVideoGrid(page)
  // Use force:true to bypass any child element interception
  await page.locator('.grid > div').first().click({ force: true })
  await expect(page).toHaveURL(/\/watch\/\d+/, { timeout: 10000 })
  await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
}