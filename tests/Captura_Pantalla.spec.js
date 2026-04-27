import { test, expect } from '@playwright/test';

test('test', async ({ page }, testInfo) => {
// Captura antes de navegar
const inicio = await page.screenshot();
await testInfo.attach('inicio', { body: inicio, contentType: 'image/png' });

await page.goto('https://ligawocdominicana.com/login');

// Captura después de navegar
const despuesNavegar = await page.screenshot();
await testInfo.attach('despues-de-navegar', { body: despuesNavegar, contentType: 'image/png' });

await page.locator('div').nth(1).click();

// Captura después de hacer click en el div
const clickDiv = await page.screenshot();
await testInfo.attach('click-div', { body: clickDiv, contentType: 'image/png' });

await page.getByRole('textbox', { name: 'Ingresa tu usuario o email' }).click();

// Captura después de hacer click en el textbox
const clickTextbox = await page.screenshot();
await testInfo.attach('click-textbox', { body: clickTextbox, contentType: 'image/png' });

await page.getByRole('textbox', { name: 'Ingresa tu usuario o email' }).fill('felix');
await page.getByRole('textbox', { name: '••••••••' }).click();
await page.getByRole('textbox', { name: '••••••••' }).fill('prueba');
await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

// Captura final después de intentar iniciar sesión
const final = await page.screenshot();
await testInfo.attach('final', { body: final, contentType: 'image/png' });
});
