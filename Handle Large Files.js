import splitFile from 'split-file'
import fs from 'fs'

let totalSize = 0

function processDir(dir = './') {
  dir[dir.length - 1] != '/' && (dir = dir + '/')

  let f
  try {
    f = fs.readdirSync(dir).map(name => ({ name, path: dir + name, stat: !fs.lstatSync(dir + name).isSymbolicLink() && fs.statSync(dir + name) }))  
  } catch (error) {
    return
  }
  

  f.map((f) => {
    if(f.name.includes('design-files'))console.log(f.path)
    if (!f.stat) return
    if (f.stat.isFile()) {
      totalSize += f.stat.size
      if (f.stat.size > 20000000) {
        splitFile.splitFileBySize(f.path, 20000000)
          .then((names) => {
            console.log(f.name)
            fs.appendFileSync('./.gitignore', '\n' + f.name.replaceAll(/[\[\]\(\)\!]/g, function (s) { return '\\' + s }))
            // console.log(names);
            names.map(name => {
              fs.appendFileSync('./.gitignore', '\n' + name.replaceAll(/[\[\]\(\)\!]/g, function (s) { return '\\' + s }))
            })
          })
          .catch((err) => {
            console.log('Error: ', err);
          });
      }
    }
    if (f.stat.isDirectory()) {
      if(f.path == './.git') return 
      if (f.name == ('.git') && !(f.path == './.git')/* && !f.path.match(/\d{2}-\d{2}-\d{4}/) */) {
        fs.renameSync(f.path, f.path + '_')
        console.log(f.path + '_')
        f.path = f.path + '_'

      }
      processDir(f.path)
    }
  })

}

let allFiles = [], allFolders = []
processDir()

console.log(totalSize)