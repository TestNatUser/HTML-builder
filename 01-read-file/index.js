const path = require('path');
const fs = require('fs');

var stream = new fs.ReadStream(path.join(__dirname,'text.txt'),{encoding: 'utf-8'});

stream.on('readable', () => {
  let data;
  while ((data = stream.read()) !== null) {
    console.log(data);
  }
});