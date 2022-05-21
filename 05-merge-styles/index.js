const fs = require('fs'); 
const path = require('path');

const dirStyle = path.join(__dirname, 'styles');
const dirBundle = path.join(__dirname, 'project-dist', 'bundle.css');

async function readDir(dirFrom) { 
  const files = await fs.promises.readdir(dirFrom, {withFileTypes: true}); // чтение папки стилей и сбор их в массив с объектами
  const fileCss = await files.filter(file => file.isFile() && path.extname(file.name) == '.css'); // фильтр только файлов стилей
  const bundle = fs.createWriteStream(dirBundle); // создание файла в папке dist
   
  fileCss.forEach(file => {
    const readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name));
    readableStream.pipe(bundle, { end: false });
  })

}

try{
  readDir(dirStyle);
}
catch(err) {
  console.log(err);
}