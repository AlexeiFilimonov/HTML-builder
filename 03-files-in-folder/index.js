const { readdir, stat } = require('fs/promises');
const path = require('path');

readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }).then((files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(__dirname, 'secret-folder', file.name);
      const extname = path.extname(filePath);
      stat(filePath).then((fileStat) => console.log(`${file.name.replace(extname, '')} - ${extname.slice(1)} - ${fileStat.size/1024}KB`));
    }
  });
});