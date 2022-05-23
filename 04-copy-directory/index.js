const fs = require('fs'); 
const path = require('path');

const viaFiles = path.join(__dirname, 'files');
const viaCopy = path.join(__dirname, 'files-copy');

async function initDir(dirTo) {
  await fs.promises.rm(dirTo, {recursive:true, force: true});
  await fs.promises.mkdir(dirTo, {recursive: true});
  copyDir(viaFiles, dirTo);
}

async function copyDir(dirFrom, dirTo) {
  const files = await fs.promises.readdir(dirFrom); // чтение папки и создание массива из файлов папки
  for (let file of files) {
    fs.promises.copyFile (path.resolve(dirFrom, file), path.resolve(dirTo, file));
  }}

try{
  initDir(viaCopy);
}
catch(err) {
  console.log(err);
}
