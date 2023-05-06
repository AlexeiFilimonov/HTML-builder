const fs = require('fs');
const path = require('path');
const writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');
const process = require('process');

console.log('Write your text:');
process.stdin.on('data', (chunk) => {
  chunk.toString().trim() === 'exit' ? process.exit() : writableStream.write(chunk);
});
process.on('SIGINT', () => process.exit());
process.on('exit', () => console.log('Bye'));