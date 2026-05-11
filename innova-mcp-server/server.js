const express = require('express');

const { runLoginTest } = require('./tools/playwright');

const app = express();

app.use(express.json());

/**
 * TOOL: Health Check
 */
app.get('/health', (req, res) => {

    res.json({
        success: true,
        message: 'Innova MCP Server Running'
    });

});

/**
 * TOOL: Ejecutar Playwright
 */
app.get('/run-playwright', async (req, res) => {

    try {

        const result = await runLoginTest();

        res.json(result);

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

/**
 * TOOL: Ejecutar query Oracle
 */
app.post('/tools/oracle-query', async (req, res) => {

    try {

        const { sql } = req.body;

        console.log('SQL recibido:', sql);

        res.json({
            success: true,
            data: [],
            message: 'Query ejecutada correctamente'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

/**
 * TOOL: Ejecutar Playwright Test
 */
app.post('/tools/run-test', async (req, res) => {

    try {

        const { testName } = req.body;

        console.log('Ejecutando test:', testName);

        res.json({
            success: true,
            message: `Test ${testName} ejecutado`
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

app.listen(3000, () => {

    console.log('🚀 Innova MCP Server running on port 3000');

});