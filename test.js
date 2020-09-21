'use strict'

const tap = require('tap')

const buildModeller = require('./')
const { Modeller } = buildModeller

tap.test('modeller', async t => {
  class Foo {
    constructor (data) {
      Object.assign(this, data)
    }

    static makeModel (name) {
      class Model extends this {}
      Object.defineProperty(Model, 'tableName', {
        value: name
      })
      return Model
    }
  }

  async function validate (modeller, Base, name) {
    const Model = modeller[name]('test')
    t.ok((new Model()) instanceof Base, `${name} instance of base model`)
    t.equal(Model.tableName, 'test', `${name} the given name`)
  }

  const modellers = {
    construct: new Modeller(Foo),
    build: buildModeller(Foo)
  }

  function middleware () {
    const { driver } = this
    const modelNames = this.modelNames = []

    this.driver = class extends driver {
      static makeModel (name) {
        const Model = super.makeModel(name)
        modelNames.push(name)
        return Model
      }
    }
  }

  for (const [modellerType, modeller] of Object.entries(modellers)) {
    t.comment(modellerType)
    modeller.use(middleware)
    await validate(modeller, Foo, 'createModel')
    await validate(modeller, Foo, 'get')
    t.deepEqual(modeller.modelNames, ['test'])
  }
})
