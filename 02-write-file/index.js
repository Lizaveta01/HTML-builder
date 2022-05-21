const fs = require('fs'); 
const path = require('path');

let writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt')); // создание файла text по пути path

const { stdin, stdout } = process;
stdout.write('Привет, введи что-нибудь \n'); // фраза приветствия при запуске файла

//вывод сообщения в консоль при ctrl + c
process.on('SIGINT', () => {
  stdout.write('Да не прибудет с тобой student 1');
  process.exit();
});

//ввод в консоль
stdin.on('data', data => {
//вывод сообщения в консоль при 'exit'
  if (data.toString().trim() == 'exit') {
    stdout.write('Да не прибудет с тобой student 1');
    process.exit();
  }
  writableStream.write(data); //запись того что вводишь в файл text
});



