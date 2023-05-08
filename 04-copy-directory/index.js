const { readdir, mkdir, copyFile, rm } = require('fs/promises');
const path = require('path');
const dest = path.join(__dirname, 'files-copy');
const src = path.join(__dirname, 'files');

function createDir() {
  mkdir(dest, { recursive: true }).then(() => copyFiles());
}

function copyFiles() {
  readdir(src, { withFileTypes: true }).then((files) => {
    files.forEach((file) => {
      copyFile(path.join(src, file.name), path.join(dest, file.name));
    });
  });
}

function copyDir() {
  rm(dest, { force: true, recursive: true }).then(() => createDir());
}
copyDir();
