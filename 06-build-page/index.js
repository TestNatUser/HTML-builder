const path = require('path');
const fs = require('fs')

const projectDist = path.join(__dirname, 'project-dist')
const html = path.join(__dirname, 'project-dist/index.html')


fs.readFile(path.join(__dirname, `components/footer.html`), { encoding: 'utf-8' },(err,data)=>{
  if(err) console.log(`Component ${file} can not be read`);
  console.log(`This is ${data}`)
})

//create project-dist
fs.mkdir(projectDist, (err) => {
  if (err) process.exit();
});

//copy html file to project-dist
fs.copyFile(path.join(__dirname, 'template.html'), html, (err) => {
  if (err) process.exit();
})

//replace variables in index.html with components

fs.readdir(path.join(__dirname, 'components'), (err, files) => {
  if (err) console.log('Components cannot be read');
  files.forEach(file => {
    const filename = path.parse(file).name;
    fs.readFile(path.join(__dirname, `components/${file}`), { encoding: 'utf-8' },(err,data)=>{
      if(err) console.log(`Component ${file} can not be read`);
      console.log(`This is ${data}`)
      fs.readFile(html, { encoding: 'utf-8' },(err,contents)=>{
        if(err) console.log(`${contents}`);
        console.log(`This is ${contents}`)
        const update = contents.replace(`{{${filename}}}`,data);
        fs.writeFile(html, { encoding: 'utf-8' },update,(err)=>{
          if(err) console.log(`Cannot write to index.html`);
        })
      });
    });
  })
})

//copy assets to project-dist
fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), (err) => {
  if (err) process.exit();
});
fs.readdir(path.join(__dirname, 'assets'), (err, files) => {
  if (err) process.exit();
  files.forEach(file => {
    fs.stat(path.join(__dirname, `project-dist/assets/${file}`), (err, stats) => {
      if (err) process.exit();
      if (stats.isDirectory()) {
        //create sub category in project-dist/assets
        fs.mkdir(path.join(__dirname, 'project-dist', 'assets', stats), (err) => {
          if (err) process.exit();
          fs.readdir(path.join(__dirname, `project-dist/assets/${stats}`), (err, assets) => {
            assets.forEach(asset => {
              fs.copyFile(path.join(__dirname, `assets/${stats}/${asset}`), path.join(__dirname, `project-dist/assets/${stats}/${asset}`), (err) => {
                if (err) process.exit();
              })
            })
          });
        });
      }
    })
  });
})

//merge styles in one
const styleStream = new fs.WriteStream(path.join(__dirname, 'project-dist', 'style.css'), { encoding: 'utf-8' });

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if (err) process.exit();
  files.forEach(file => {
    if (path.extname(file).match('.css')) {
      const input = new fs.ReadStream(path.join(__dirname, 'styles', file));
      input.pipe(styleStream)
    }
  })
})