import {Chalk} from 'chalk';
const customChalk = new Chalk({level: 1})

console.log('__disable_ansi_serialization')

// eslint-disable-next-line prefer-template
console.log(customChalk.blue('Hello') + ' World' + customChalk.red('!'))
