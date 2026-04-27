//importar funciones de Playwright test
import { test, expect } from '@playwright/test';    

//definir el bloque de pruebas

test('Localizadores test', async ({page})=>{
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'); 

  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.pause();
  await page.getByRole('button', { name: 'Login' }).click();
  //await expect(page.getByText('Bienvenido al sistema de gestión')).toBeVisible();
});

