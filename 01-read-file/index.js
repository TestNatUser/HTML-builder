const path = require('path');
const fs = require('fs');

var stream = new fs.ReadStream(path.join(__dirname,'text.txt'),{encoding: 'utf-8'});

stream.on('readable', function(){
    var data = stream.read();
    console.log(data);
});