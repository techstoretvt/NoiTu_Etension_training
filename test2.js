let contentJson = require('./content-json.json')
const fs = require('fs');
contentJson = contentJson.map(item => item.toLowerCase())

const jsonContent = JSON.stringify(contentJson, null, 2);
fs.writeFile('content-json.json', jsonContent, 'utf8', (err) => {
    if (err) {
        console.error('Error writing to JSON file:', err);
    }
    console.log('JSON file overwritten successfully.');
});

console.log(contentJson);