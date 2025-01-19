const path = require('path');
const fs = require('fs')

function copyDir(){
  fs.mkdir(path.join(__dirname,'file-copy'),(err)=>{
    if(err) process.exit();
  });
  fs.readdir(path.join(__dirname,'files'),(err,files)=>{
    if(err) process.exit();
    files.forEach(file=>{
      fs.copyFile(path.join(__dirname,`files/${file}`),path.join(__dirname,`file-copy/${file}`),(err)=>{
        if(err) process.exit();
      })
    })
  })
}

copyDir();
