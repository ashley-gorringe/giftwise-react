const fs = require('fs-extra');
const path = require('path');

async function addTimestamp() {
    const filePath = path.join(__dirname, './build/index.html');
    let html = await fs.readFile(filePath, 'utf8');
    const timestamp = Date.now();
    html = html.replace(/%REACT_APP_BUILD_TIME%/g, timestamp);
    await fs.writeFile(filePath, html);
}

addTimestamp().catch(console.error);
