const path = require('path');
const fs = require('fs');
const process = require('process');

const stream = new fs.WriteStream(path.join(__dirname, 'text.txt'), { encoding: 'utf-8' });

stream.on('open', () => {
  console.log("Welcome! Enter the text");
  const input = process.stdin;
  input.pipe(stream);
})

process.stdin.on("data",data=>{
  if(data.toString().trim()==='exit'){
    console.log("Bye-bye using keyword exit")
    stream.close();
    process.exit();
  } 
})

process.on('SIGINT', () => {
  console.log("Bye-bye!")
  stream.close();
  process.exit();
})