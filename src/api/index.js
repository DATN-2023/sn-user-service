module.exports = (app, container) => {
  require('./userApi')(app, container)
  require('./friendApi')(app, container)
  require('./sdpApi')(app, container)
  require('./cdcApi')(app, container)
}
