<div align="center">
<h1>CLI Testing Library [WIP]</h1>

<a href="https://www.joypixels.com/profiles/emoji/1f428">
  <img
    height="80"
    width="80"
    alt="koala"
    src="./other/koala.png"
  />
</a>

<p>Simple and complete CLI testing utilities that encourage good testing
practices.</p>

</div>

<hr />

[![Build Status](https://img.shields.io/github/workflow/status/crutchcorn/cli-testing-library/validate/main.svg?style=flat-square)](https://github.com/crutchcorn/cli-testing-library/actions/workflows/validate.yml?query=branch%3Amain)
[![version](https://img.shields.io/npm/v/cli-testing-library?style=flat-square)](https://www.npmjs.com/package/cli-testing-library)
[![downloads](https://img.shields.io/npm/dw/cli-testing-library?style=flat-square)](https://www.npmjs.com/package/cli-testing-library)
[![MIT License](https://img.shields.io/npm/l/cli-testing-library?style=flat-square)](./LICENSE)
[![All Contributors](https://img.shields.io/badge/all_contributors-7-blue.svg?style=flat-square)](#contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](makeapullrequest.com)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square)](./CODE_OF_CONDUCT.md)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![Watch on GitHub](https://img.shields.io/github/watchers/crutchcorn/cli-testing-library.svg?style=social)](https://github.com/crutchcorn/cli-testing-library/watchers)
[![Star on GitHub](https://img.shields.io/github/stars/crutchcorn/cli-testing-library.svg?style=social)](https://github.com/crutchcorn/cli-testing-library/stargazers)
<!-- prettier-ignore-end -->

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
- [Contributors ✨](#contributors-)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


> This project is not affiliated with the ["Testing Library"](https://github.com/testing-library) ecosystem that this project is
> clearly inspired from. We're just big fans :)


## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev cli-testing-library
```

## Usage

> This is currently the only section of "usage" documentation. We'll be expanding it as soon as possible

Usage example:

```javascript
const {resolve} = require('path')
const {render} = require('cli-testing-library')

test('Is able to make terminal input and view in-progress stdout', async () => {
  const {cleanup, findByText, userEvent} = await render('node', [
    resolve(__dirname, './execute-scripts/stdio-inquirer.js'),
  ])

  const instance = await findByText('First option')

  expect(instance).toBeTruthy()

  expect(await findByText('❯ One')).toBeTruthy()

  cleanup()

  userEvent("[ArrowDown]")

  expect(await findByText('❯ Two')).toBeTruthy()

  cleanup()

  userEvent.keyboard("[Enter]")

  expect(await findByText('First option: Two')).toBeTruthy()
})
```

> While this library _does_ work in Windows, it does not appear to function properly in Windows CI environments, such
> as GitHub actions. As a result, you may need to either switch CI systems or limit your CI to only run in Linux
> 
> If you know how to fix this, please let us know in [this tracking issue](https://github.com/crutchcorn/cli-testing-library/issues/3)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://crutchcorn.dev/"><img src="https://avatars.githubusercontent.com/u/9100169?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Corbin Crutchley</b></sub></a><br /><a href="https://github.com/crutchcorn/cli-testing-library/commits?author=crutchcorn" title="Code">💻</a> <a href="https://github.com/crutchcorn/cli-testing-library/commits?author=crutchcorn" title="Documentation">📖</a> <a href="#maintenance-crutchcorn" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
