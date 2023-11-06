module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { writeController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.put(`${basePath}/cdc/users/:id`, writeController.updateUser)
  app.delete(`${basePath}/cdc/users/:id`, writeController.deleteUser)
  app.post(`${basePath}/cdc/users`, writeController.addUser)
  app.put(`${basePath}/cdc/friends/:id`, writeController.updateFriend)
  app.delete(`${basePath}/cdc/friends/:id`, writeController.deleteFriend)
  app.post(`${basePath}/cdc/friends`, writeController.addFriend)
}
