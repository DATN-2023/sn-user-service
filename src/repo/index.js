const repo = (container) => {
  const userRepo = require('./userRepo')(container)
  const friendRepo = require('./friendRepo')(container)
  return { userRepo, friendRepo }
}
const connect = (container) => {
  const dbPool = container.resolve('db')
  if (!dbPool) throw new Error('Connect DB failed')
  return repo(container)
}

module.exports = { connect }
