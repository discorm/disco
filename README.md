# @disco/disco

[![CI status](https://github.com/discorm/disco/workflows/ci/badge.svg)](https://github.com/discorm/disco/actions?query=workflow%3Aci+branch%3Amaster)
[![Coverage Status](https://coveralls.io/repos/discorm/disco/badge.png)](https://coveralls.io/r/discorm/disco)

Disco is a full-featured ORM that takes advantage of async/await,
which makes the codebase and usage of the library vastly simpler.
I spent weeks digging through existing node ORM implementations,
only to find myself dissatisfied with how convoluted they were.

## Installation

```sh
npm install @disco/disco
```

## Usage

```js
const mongo = require('@disco/mongodb')
const disco = require('@disco/disco')

const driver = mongo('mongodb://localhost/database')
const model = disco(driver)

const User = model.createModel('user', {
  firstName: String,
  lastName: String
})

const me = new User({
  firstName: 'Stephen',
  lastName: 'Belanger'
})

await me.save()
```

### Custom Drivers

A driver is just a factory function which accepts a name and schema
and produces a model class.

```js
const disco = require('@disco/disco')
const assert = require('assert')

const model = disco((name, schema) => {
  return class Greeter {
    constructor (data) {
      Object.assign(this, schema.validate(schema.filter(data)))
    }

    greet () {
      return `Hello, ${this.name}`
    }
  }
})

const Greeter = model.createModel('greeter', {
  name: String
})

const me = new Greeter({ name: 'stephen' })
console.log(me.greet())
```

## Notes

In typical node fashion, this module is meant to be simple. This means it lacks
many features you may expect of a typical ORM which are intended to be
implemented externally. The model itself is provided by the driver factory,
which means it could be anything. The expected form is to wrap
[@disco/base-driver](https://npmjs.org/package/@disco/base-driver) to produce a
model class tailored to the specific data storage system needed. The base
driver does not include relational components, that is provided by yet another
external module.

## License

[MIT](./LICENSE)
