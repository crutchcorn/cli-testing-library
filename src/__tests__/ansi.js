const {resolve} = require('path')
const {render, cleanup} = require('../pure')
const {fireEvent} = require('../events')
const {waitFor} = require('../wait-for')
const {default: userEvent} = require('../user-event')


test('Should handle argument passing', async () => {
  const props = await render('node', [
    resolve(__dirname, './execute-scripts/clear.js')
  ], {
    debug: true
  })

  console.log(props.stdoutStr.toString());
})
