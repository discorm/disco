'use strict'

class Modeller extends Map {
  constructor (driver) {
    super()
    this.driver = driver
  }

  use (middleware) {
    middleware.call(this, this)
  }

  createModel (name, options) {
    const Model = this.driver.makeModel(name, options)
    this.set(name, Model)
    return Model
  }
}

function buildModeller (driver) {
  return new Modeller(driver)
}

buildModeller.Modeller = Modeller

module.exports = buildModeller
