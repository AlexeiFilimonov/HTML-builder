const { readdir } = require('fs/promises');
const fs = require('fs');
const path = require('path');
const writableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');
const stylesPath = path.join(__dirname, 'styles');

readdir(stylesPath, { withFileTypes: true }).then((files) => {
  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const readableStream = fs.createReadStream(path.join(stylesPath, file.name), 'utf-8');
      readableStream.on('data', (chunk) => {
        writableStream.write(chunk.toString() + '\n');
      });
    }
  });
});