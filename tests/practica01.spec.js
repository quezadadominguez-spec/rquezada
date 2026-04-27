//importar librerías de Playwright test
import { test, expect } from '@playwright/test';

//login usuario y contraseña
test('Login automatizado en OrangeHRM demo', async ({ page }) => {
 await page.pause();
    // 1) Ir a la página de login
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');


    // 2) Rellenar usuario y contraseña
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');

     // 3) Hacer clic en el botón de login
    await page.click('button[type="submit"]');

    // seleccionar boton pim
    await page.getByRole('link', { name: 'PIM' }).click();

    // seleccionar boton + add
    await page.getByRole('button', { name: 'Add' }).click();
}) ;