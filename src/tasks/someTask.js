const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const sourceFolder = "D:/CODE_BASE/MEP_V6_CORE/_trunk/views/store/modules/mgrUserMgr"


fs.readdir(sourceFolder, (err, files) => {
  console.log(chalk.yellow('Reading Files from : ', sourceFolder))

  let convertFns = files.map(file => {
    console.log(chalk.green.bold(file))

  })

})




