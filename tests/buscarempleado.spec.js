//importar librerías de Playwright test
import { test, expect } from '@playwright/test';

//login usuario y contraseña
test('Login automatizado en OrangeHRM demo', async ({ page }) => {
 await page.pause();
    // 1) Ir a la página de login
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');


    // 2) Rellenar usuario y contraseña
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin144');
    
    // 3) Hacer clic en el botón de login
    await page.click('button[type="submit"]');

    // 4) seleccionar boton pim 
    await page.getByRole('link', { name: 'PIM' }).click();

    // 5) hacer click en oxd-topbar-body-nav-tab-item Employee List
    await page.getByRole('link', { name: 'Employee List' }).click();

    // 6) hacer click en el campo Employee Name
    await page.getByPlaceholder('Type for hints...').click();

    // 7) escribir el nombre del empleado
    await page.getByPlaceholder('Type for hints...').fill('0295');
