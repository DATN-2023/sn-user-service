module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { readController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/sdp/users`, readController.getUser)
  app.get(`${basePath}/sdp/users/ids`, readController.getUserByIds)
  app.get(`${basePath}/sdp/users/:id`, readController.getUserById)
  app.get(`${basePath}/sdp/friends`, readController.getFriend)
  app.get(`${basePath}/sdp/friends/:id`, readController.getFriendById)
}
