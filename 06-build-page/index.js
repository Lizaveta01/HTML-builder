const fs = require('fs'); 
const path = require('path');

const dirDist = path.join(__dirname, 'project-dist');
const fileIndex = path.join(__dirname, 'template.html');
const dirComp = path.join(__dirname, 'components');
const fileBundle = path.join(dirDist, 'index.html');
const fileStyles  = path.join(dirDist, 'style.css');
const dirAssets = path.join(__dirname, 'assets');
const copyAssets = path.join(dirDist, 'assets');
const dirStyles = path.join(__dirname, 'styles');

createDir();

async function createDir() {
  await fs.promises.mkdir(dirDist, {recursive: true}); // создание папки
  replaceContent();
}

async function replaceContent() {
  const readfile = fs.createReadStream(fileIndex); //присваивает переменной стрим для чтения template.html
  let dataHtml = '';
  // начало чтения файла
  readfile.on('data', chunk => dataHtml += chunk); // поступившие внутринности template.html при чтении файл template перемещается в data = ' <!DOCTYPE html>.....</body></html>'
  // когда чтение закончилось файл запускается функция и передает строковое значение прочитанного файла
  readfile.on('end', () => replaceFile(dataHtml));
  readfile.on('error', error => console.log(error.message));

  async function replaceFile() {
    const files = await fs.promises.readdir(dirComp, {withFileTypes: true}); // create array from files in components

    for (let file of files) {
      const filePath = path.resolve(dirComp, file.name); // считываем путь до каждого отдельного файла из components
      const fileType = path.extname(file.name); // находим расширение файла
      //выполняем проверку файла на соответствие .html
      
      if (fileType == '.html') {
        const fileTemplate = await fs.promises.readFile(filePath, 'utf-8'); // читаем файл чтобы его вставить в шаблонную строку
        const fileName = file.name.split('.')[0]; // определяем имя чтобы вставлять автоматически в шаблон
        const regExp = new RegExp (`{{${fileName}}}`,'g'); // шаблонная строка которую нужно найти и вставить другое значение
        dataHtml = dataHtml.replace(regExp, fileTemplate); // замена строк
      }
    }
    await fs.promises.writeFile(fileBundle, dataHtml); // записываем измененные данные в файл
  }
  complateStyles();
  copyDir(dirAssets, copyAssets);
}

async function complateStyles () { 
  const files = await fs.promises.readdir(dirStyles, {withFileTypes: true}); // чтение папки стилей и сбор их в массив с объектами
  const fileCss = await files.filter(file => file.isFile() && path.extname(file.name) == '.css'); // фильтр только файлов стилей
  const styleFile = fs.createWriteStream(fileStyles); // создание файла в папке dist
  
  fileCss.forEach(file => {
    const readableStream = fs.createReadStream(path.join(dirStyles, file.name)); // читаем каждый файл сss
    readableStream.pipe(styleFile, { end: false }); // передаем каждый файлл css по трубопроводу к общему созданному файлу стилей
  });
}

async function copyDir(dirFrom, dirTo) {
  await fs.promises.rm(dirTo, {recursive:true, force: true}); // удаление папки если она есть 
  await fs.promises.mkdir(dirTo, {recursive: true}); // создание папки
  const files = await fs.promises.readdir(dirFrom, {withFileTypes: true}); // чтение папки и создание массива из файлов папки

  for (let file of files) {
    const filePath = path.resolve(dirFrom, file.name);
    const filePathCopy = path.resolve(dirTo, file.name);

    if (file.isDirectory()) {
      copyDir(filePath, filePathCopy); // рекурсивный обход если это папка
    } else if (file.isFile()) {
      fs.promises.copyFile (filePath, filePathCopy);
    } 
  }
}






