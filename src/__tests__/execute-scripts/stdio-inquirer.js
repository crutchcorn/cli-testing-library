const inquirer = require('inquirer');

inquirer
    .prompt([
        {
            type: 'list',
            name: 'theme',
            message: 'First option:',
            choices: [
                'One',
                'Two',
                'Three'
            ],
        },

        {
            type: 'list',
            name: 'other',
            message: 'Second option:',
            choices: [
                'One',
                'Two',
                'Three'
            ],
        },
    ])
    .then((answers) => {
        // Use user feedback for... whatever!!
    })
    .catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
            // Something else went wrong
        }
    });
