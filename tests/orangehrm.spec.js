//importar Playwright test
import { test, expect } from '@playwright/test';

//definir el bloque de pruebas
test('Tarea Localizadores test', async ({page})=>{
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

//completar el usuario y la contraseña
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.pause();
    await page.getByRole('button', { name: 'Login' }).click();
    //await expect(page.getByText('Bienvenido al sistema de gestión')).toBeVisible();

// seleccionar el menu My Admin
    await page.getByRole('link', { name: 'Admin' }).click();


// seleccionar boton + add
    await page.getByRole('button', { name: 'Add' }).click();

// Click en el dropdown usando el texto visible
    await page.getByText('Admin', { exact: true }).click();

// Seleccionar la opción
//await page.getByText('Admin', { exact: true }).click();


  });