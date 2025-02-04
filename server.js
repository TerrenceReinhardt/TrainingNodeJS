const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const puppeteer = require('puppeteer');
const { insertUser } = require('./database');

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
    res.send('Welcome to the User Management System!');
});

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const users = xlsx.utils.sheet_to_json(sheet);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        for (let user of users) {
            const { Name, Email } = user;
            let status = 'failed';

            try {
                await page.goto('https://example.com'); // Replace with your actual URL
                await page.type('#email', Email);
                await page.click('#submit');
                await page.waitForSelector('#success-message', { timeout: 3000 });
                status = 'succeed';
            } catch (error) {
                console.log(`Error processing user ${Name}:`, error);
            }
            await insertUser(Name, Email, status);
        }
        await browser.close();
        res.send('File processed successfully.');

    } catch (err) {
        console.error('Error reading Excel file or processing users:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
