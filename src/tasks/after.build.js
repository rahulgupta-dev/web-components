const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const sourceFolder = path.join(__dirname, '../../dist/mep-components')
const destFolder = path.join(__dirname, '../../../src/main/webapp/js/mep-components')

function copyFiles (item) {
  return new Promise((resolve, reject) => {
    if (destFolder) {
      console.log(chalk.gray(`Copying ${item} to : `, destFolder))
      fs.copyFileSync(path.join(sourceFolder, item), path.join(destFolder, item))
      resolve()
    }
  })
}

fs.readdir(sourceFolder, (err, files) => {
  console.log(chalk.yellow('Reading Files from : ', sourceFolder))
  if (fs.existsSync(destFolder)) {
    fs.rmdirSync(destFolder, { recursive: true })
  }
  fs.mkdirSync(destFolder, { recursive: true })
  let convertFns = files.map(file => copyFiles(file))
  Promise.all(convertFns).then(() => {
    console.log(chalk.green.bold('File copied successfully !'))
  })
})






