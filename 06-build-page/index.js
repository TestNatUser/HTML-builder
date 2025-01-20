const fs = require('fs');
const pr = fs.promises;
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist')
const html = path.join(__dirname, 'project-dist/index.html')

//create project-dist

async function createIndex() {
  await pr.mkdir(projectDist);
  await pr.copyFile(path.join(__dirname, 'template.html'), html)
}

async function createHtml() {
  let toUpdate = (await pr.readFile(html, 'utf8')).toString();
  const files = await pr.readdir(path.join(__dirname, 'components'));
  for (file of files) {
    const filename = path.parse(file).name;
    const data = await pr.readFile(path.join(__dirname, `components/${file}`), 'utf-8');
    toUpdate = toUpdate.replace(`{{${filename}}}`, data);
  }
  await pr.writeFile(html, toUpdate)
}

async function run() {
  await createIndex();
  await createHtml();
  await assets();
  await mergeStyle();
}

run()

// //copy assets to project-dist
async function assets() {
  fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), (err) => {
    if (err) process.exit();
  });
  fs.readdir(path.join(__dirname, 'assets'), (err, files) => {
    console.log('Copy assets')
    if (err) console.log(`Cannot read assets folder`);
    files.forEach(file => {
      fs.stat(path.join(__dirname, `assets/${file}`), (err, stats) => {
        if (err) process.exit();
        if (stats.isDirectory()) {
          //create sub category in project-dist/assets
          fs.mkdir(path.join(__dirname, 'project-dist', 'assets', file), (err) => {
            if (err) console.log(`Cannot create assets folder`);
            fs.readdir(path.join(__dirname, `assets/${file}`), (err, assets) => {
              assets.forEach(asset => {
                fs.copyFile(path.join(__dirname, `assets/${file}/${asset}`), path.join(__dirname, `project-dist/assets/${file}/${asset}`), (err) => {
                  if (err) console.log(`Cannot copy file ${asset}`);
                })
              })
            });
          });
        }
      })
    });
  })
}

// //merge styles in one
async function mergeStyle() {
  const styleStream = new fs.WriteStream(path.join(__dirname, 'project-dist', 'style.css'), { encoding: 'utf-8' });

  fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
    console.log("Start to create style.css")
    if (err) process.exit();
    files.forEach(file => {
      if (path.extname(file).match('.css')) {
        const input = new fs.ReadStream(path.join(__dirname, 'styles', file));
        input.pipe(styleStream)
      }
    })
  })
}

// //replace variables in index.html with components

// fs.readdir(path.join(__dirname, 'components'), (err, files) => {
//   console.log(`Replace variables with components`);
//   if (err) console.log('Components cannot be read');
//   let update;
//   files.forEach(file => {
//     const filename = path.parse(file).name;
//     fs.readFile(path.join(__dirname, `components/${file}`), 'utf-8' ,(err,data)=>{
//       if(err) console.log(`Component ${file} can not be read`);
//       fs.readFile(html, 'utf8',(err,contents)=>{
//         console.log('Test')
//         if(err) console.log(`Error reading file ${file}`);
//         update = contents;
//         update = update.replace(`{{${filename}}}`,data.trim());
//         fs.writeFile(html, update,'utf8',(err)=>{
//           console.log('Start copy')
//           if(err) console.log(`Cannot write to index.html`);
//         })
//       });
//     });
//   })
// })

// fs.readdir(path.join(__dirname, 'components'), (err, files) => {
//   console.log(`Replace variables with components`);
//   if (err) console.log('Components cannot be read');
//   let update = template;
//   for(file of files){
//   // files.forEach(file => {
//     const filename = path.parse(file).name;
//     fs.readFile(path.join(__dirname, `components/${file}`), 'utf-8' ,(err,data)=>{
//       if(err) console.log(`Component ${file} can not be read`);
//         console.log(template)
//         if(err) console.log(`Error reading file ${file}`);
//         update = update.replace(`{{${filename}}}`,data.trim());
//         console.log(update)
//         fs.writeFile(html, update,'utf8',(err)=>{
//           console.log('Start copy')
//           if(err) console.log(`Cannot write to index.html`);
//         })
//     });
//   }
//   // })
// })