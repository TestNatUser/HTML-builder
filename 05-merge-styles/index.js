const path = require('path');
const fs = require('fs')

const stream = new fs.WriteStream(path.join(__dirname,'project-dist', 'bundle.css'), { encoding: 'utf-8' });

fs.readdir(path.join(__dirname,'styles'),(err,files)=>{
  if(err) process.exit();
  files.forEach(file=>{
    if(path.extname(file).match('.css')){
      const input = new fs.ReadStream(path.join(__dirname,'styles',file));
      input.pipe(stream)
    }
  })
})