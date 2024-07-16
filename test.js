const fs = require('fs');
const readline = require('readline');

// Đường dẫn đến tệp txt
const filePath = 'words.txt';

// Tạo một đối tượng Interface cho việc đọc tệp
const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    output: process.stdout,
    terminal: false
});

let arr = []

// Xử lý mỗi dòng khi được đọc
rl.on('line', (line) => {
    // In dòng văn bản vào console
    let jsonStr = JSON.parse(line)
    console.log(jsonStr.text);
    if (jsonStr?.text?.split(' ')?.length === 2) {
        arr.push(jsonStr.text)
    }

    // Ở đây bạn có thể thực hiện các thao tác xử lý dòng văn bản
});

// Xử lý sự kiện khi đọc tệp kết thúc
rl.on('close', () => {
    console.log('Đã đọc xong tệp.');
    const jsonContent = JSON.stringify(arr, null, 2);
    fs.writeFile('content-json.json', jsonContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to JSON file:', err);
        }
        console.log('JSON file overwritten successfully.');
    });
});
