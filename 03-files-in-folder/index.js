const path = require('path');
const fs = require('node:fs')

fs.readdir(path.join(__dirname, 'secret-folder'), (err, files) => {
  if(err) process.exit();
  files.forEach(file => {
    fs.stat(path.join(__dirname, `secret-folder/${file}`), (err, stats) => {
      if(err) process.exit();
      if (stats.isFile()) {
        console.log(`${path.parse(file).name} - ${path.extname(file).replace('.','')} - ${stats.size} bytes`)
      } 
    })
  });
})
