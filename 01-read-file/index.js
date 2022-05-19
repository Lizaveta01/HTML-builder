const fs = require('fs'); // file system
const path = require('path');

const via = path.join(__dirname, 'text.txt');
let readableStream = fs.createReadStream(via, 'utf-8');

readableStream.on('data', function(chunk){
  console.log(chunk);
});
