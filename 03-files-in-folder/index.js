const fs = require('fs'); 
const path = require('path');

const via = path.join(__dirname, 'secret-folder');

fs.readdir(via, function (err, items){
  if (err) {
    console.log(error);
  }

  for(let i=0; i < items.length; i++) {
        
    let file = path.resolve(via, items[i]);
    fs.stat(file, (err, stats) => {
      if (err) {
        throw error;
      }

      if(stats.isFile()){
        let fileName =  path.parse(file).name;
        let fileExt = path.parse(file).ext.toString().slice(1);
        let fileSize = (stats.size / 1024).toFixed(3);
        console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
      }
    });        
  }
});