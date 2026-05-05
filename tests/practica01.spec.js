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

    // 5) seleccionar boton + add
    await page.getByRole('button', { name: 'Add' }).click();

    // 6) completar el campo First Name, middle name y last name
    await page.getByPlaceholder('First Name').fill('Reynaldo');
    await page.getByPlaceholder('Middle Name').fill('Quezada');
    await page.getByPlaceholder('Last Name').fill('Dominguez');

    // 7) seleccionar checkbox de Create Login Details
   // await page.getByText('Create Login Details').click();
   
    // 8) completar campo oxd-input oxd-input--active
   // await page.locator('.oxd-input').nth(4).fill('Reynaldo'); // Reemplaza 'Reynaldo123' con el valor que deseas ingresar en Employee Id

    // 9) completar el campo password y confirm password, este campo no es placeholder, es un input activo
    //await page.locator('.oxd-input').nth(5).fill('Reynaldo123'); // Reemplaza 'Reynaldo123' con el valor que deseas ingresar en Other Id
    // await page.locator('.oxd-input--active').nth(6).fill('Reynaldo123'); // Reemplaza 'Reynaldo123' con el valor que deseas ingresar en Other Id   


    // 10) click en el boton save
    await page.getByRole('button', { name: 'Save' }).last().click();

}) ;