import { test, expect } from '@playwright/test';
test('Login automatizado en OrangeHRM demo', async ({ page }) => {
  // 1) Ir a la página de login
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  // 2) Rellenar usuario y contraseña
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');

  // 3) Hacer clic en el botón de login
  await page.click('button[type="submit"]');

  // 4) Hacer clic en el botón My Info
  await expect(page.getByText('My Info')).toBeVisible();
  await page.getByText('My Info').click();

  
  // 5)placeholder campo First Name
  await page.getByPlaceholder('First Name').fill('Reynaldo');

  // 6) Hacer clic en el campo Employee Id
  await page.locator('.oxd-input--active').nth(4).fill('12345'); // Reemplaza '12345' con el valor que deseas ingresar en Employee Id

    
  // 7) completar el campo Other Id 
 await page.locator('.oxd-input--active').nth(5).fill('54321'); // Reemplaza '54321' con el valor que deseas ingresar en Other Id

  // 8) seleccionar checkbox de Female
await page.getByText('Female').click();



  // 9) Hacer clic en el boton save
  await page.getByRole('button', { name: 'Save' }).last().click();




  // 4) Esperar a que cargue la página de dashboard
  //await page.waitForNavigation();


   //5) Verificar que el dashboard se ve (opcional)
  //await expect(page.locator('h6:has-text("Dashboard")')).toBeVisible();