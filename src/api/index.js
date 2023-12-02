module.exports = (app, container) => {
  const { verifyInternalToken } = container.resolve('middleware')
  require('./userApi')(app, container)
  require('./friendApi')(app, container)
  app.use(verifyInternalToken)
  require('./readApi')(app, container)
  require('./writeApi')(app, container)
  require('./internalApi')(app, container)
}
