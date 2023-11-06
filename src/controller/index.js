module.exports = (container) => {
  const userController = require('./userController')(container)
  const friendController = require('./friendController')(container)
  const readController = require('./readController')(container)
  const writeController = require('./writeController')(container)
  return { userController, friendController, readController, writeController }
}
