const { readdir, mkdir, copyFile, rm, readFile } = require('fs/promises');
const fs = require('fs');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');
const assetsSrc = path.join(__dirname, 'assets');
const assetsCopyPath = path.join(projectDist, 'assets');
const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');
const stylesPath = path.join(__dirname, 'styles');

function createDir(copyDist) {
  return mkdir(copyDist, { recursive: true });
}

function copyFiles(copySrc, copyDest) {
  readdir(copySrc, { withFileTypes: true }).then((files) => {
    files.forEach((file) => {
      if (file.isDirectory()) copyDir(path.join(copySrc, file.name), path.join(copyDest, file.name));
      else copyFile(path.join(copySrc, file.name), path.join(copyDest, file.name));
    });
  });
}

function copyDir(copySrc, copyDest) {
  rm(copyDest, { force: true, recursive: true })
    .then(() => createDir(copyDest))
    .then(() => copyFiles(copySrc, copyDest));
}

async function createHTMLFile() {
  let strData = (await readFile(templatePath)).toString();
  const components = await readdir(componentsPath, { withFileTypes: true });
  for (const component of components) {
    if (component.isFile() && path.extname(component.name) === '.html') {
      const compStrData = (await readFile(path.join(componentsPath, component.name))).toString();
      strData = strData.replaceAll(`{{${component.name.replace(path.extname(component.name), '')}}}`, compStrData);
    }
  }
  const htmlWriter = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  htmlWriter.write(strData);
}

function mergeStyles() {
  const syleWriter = fs.createWriteStream(path.join(projectDist, 'style.css'), 'utf-8');
  readdir(stylesPath, { withFileTypes: true }).then((files) => {
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const readableStream = fs.createReadStream(path.join(stylesPath, file.name), 'utf-8');
        readableStream.on('data', (chunk) => {
          syleWriter.write(chunk.toString() + '\n');
        });
      }
    });
  });
}

rm(projectDist, { force: true, recursive: true })
  .then(() => {
    createDir(projectDist)
      .then(() => copyDir(assetsSrc, assetsCopyPath));
    createHTMLFile();
    mergeStyles();
  });
