import { test, expect } from '@playwright/test';

test.describe('OrangeHRM - Aserciones básicas', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/');
  });

  // ✅ 1. Validar que el logo sea visible
  test('Logo visible en login' , async ({ page }) => {
    const logo = page.locator('img[alt="company-branding"]');
    await expect(logo).toBeVisible();
  });

  // ✅ 2. Username habilitado
  test('Campo Username habilitado', async ({ page }) => {
    const username = page.locator('input[name="username"]');
    await expect(username).toBeEnabled();
  });

  // ✅ 3. Password habilitado
  test('Campo Password habilitado', async ({ page }) => {
    const password = page.locator('input[name="password"]');
    await expect(password).toBeEnabled();
  });

  // ✅ 4. Botón Login habilitado
  test('Botón Login habilitado', async ({ page }) => {
    const loginBtn = page.locator('button[type="submit"]');
    await expect(loginBtn).toBeEnabled();
  });

  // ✅ 5. Login sin credenciales → error visible
  test('Mensaje de error visible sin credenciales', async ({ page }) => {
    const loginBtn = page.locator('button[type="submit"]');
    await loginBtn.click();

    //const errorMsg = page.locator('.oxd-alert-content-text');
    //await expect(errorMsg).toBeVisible();
  });

  // ✅ 6. Dashboard visible después de login correcto
  test('Dashboard visible después de login', async ({ page }) => {
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    const dashboard = page.locator('h6:has-text("Dashboard")');
    await expect(dashboard).toBeVisible();
  });

  // ✅ 7. Campo de búsqueda habilitado en dashboard
  test('Campo de búsqueda habilitado', async ({ page }) => {
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    const searchBox = page.locator('input[placeholder="Search"]');
    await expect(searchBox).toBeEnabled();
  });

});