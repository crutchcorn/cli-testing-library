const inquirer = require('inquirer')

inquirer.prompt([
  {
    type: 'list',
    name: 'value',
    message: 'First option:',
    choices: ['One', 'Two', 'Three'],
  },
])
