module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { friendController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/friends`, friendController.getFriend)
  app.get(`${basePath}/friends/:id`, friendController.getFriendById)
  app.put(`${basePath}/friends/:id`, friendController.updateFriend)
  app.delete(`${basePath}/friends/:id`, friendController.deleteFriend)
  app.post(`${basePath}/friends`, friendController.addFriend)
}
