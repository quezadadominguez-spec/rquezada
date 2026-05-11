const { chromium } = require('playwright');

async function runLoginTest() {

    const browser = await chromium.launch({

        headless: false,

        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

    });

    const page = await browser.newPage();

    // Ir al login
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // Completar usuario
    await page.getByPlaceholder('Username').fill('Admin');

    // Completar password
    await page.locator('input[type="password"]').fill('admin123');

    // Login
    await page.getByRole('button', { name: 'Login' }).click();

    // Esperar Dashboard
    await page.waitForURL('**/dashboard/**');

    // Screenshot
    await page.screenshot({
        path: 'dashboard.png',
        fullPage: true
    });

    const title = await page.title();

    await browser.close();

    return {
        success: true,
        title,
        screenshot: 'dashboard.png',
        message: 'Login ejecutado correctamente'
    };

}

module.exports = {
    runLoginTest
};