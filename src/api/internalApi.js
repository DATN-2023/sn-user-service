module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { internalController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/internal/users`, internalController.getListUserByIdsSDP)
}
