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

    // 4) seleccionar boton pim 
    await page.getByRole('link', { name: 'PIM' }).click();

    // 5) hacer click en oxd-topbar-body-nav-tab-item Employee List
    await page.getByRole('link', { name: 'Employee List' }).click();

    // 6) hacer click en el campo Employee Name
   // await page.getByPlaceholder('Type for hints...').click();

    // 7) escribir el nombre del empleado
    await page.getByPlaceholder('Type for hints...').first().fill('Reynaldo');

    // 8) hacer click en el boton search
    await page.getByRole('button', { name: 'Search' }).click(); 

    // 9) Eliminar el empleado localizador oxd-icon bi-trash-fill
    //await page.locator('.oxd-icon.bi-pencil-fill').click();
    await page.locator('oxd-table-cell-action-space').click();

    
    // 10) Confirmar la eliminación del empleado
    await page.getByRole('button', { name: 'Yes, Delete' }).click();

 

}) ;
