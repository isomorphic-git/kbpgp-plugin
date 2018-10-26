# @isomorphic-git/kbpgp-plugin

A 'pgp' plugin for [a future version of] isomorphic-git using kbpgp

Note: no version of isomorphic-git has been released that uses this plugin yet.

It's a chicken and egg problem. Gotta write the plugin first, then modify isomorphic-git to use it.

## Usage

```js
// Node
const { pgp } = require('@isomorphic-git/kbpgp-plugin')
const git = require('isomorphic-git')

git.plugins.set('pgp', pgp)

// Now you can use git.sign() and git.verify()
```

```js
// Browser
import { plugins } from 'isomorphic-git'
import { pgp } from '@isomorphic-git/kbpgp-plugin'

git.plugins.set('pgp', pgp)

// Now you can use git.sign() and git.verify()
```

## Tests

```sh
npm test
```

## License

MIT
