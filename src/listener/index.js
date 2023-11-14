module.exports = container => {
  const { workerConfig } = container.resolve('config')
  const subscriber = container.resolve('subscriber')
  const logger = container.resolve('logger')
  const mediator = container.resolve('mediator')
  const { userRepo } = container.resolve('repo')
  const {
    schemaValidator
  } = container.resolve('models')
  const jobs = []
  const EVENT_NAME = 'nextjob'
  mediator.on(EVENT_NAME, async () => {
    if (jobs.length) {
      const msg = jobs.shift()
      await handle(msg)
    }
  })

  subscriber.on('message', async msg => {
    logger.d('newMessage', new Date())
    // await handle(msg)
    jobs.push(msg)
    setTimeout(() => {
      mediator.emit(EVENT_NAME, '')
    }, 500)
  })

  const handleMessage = async (message) => {
    const { customerId, email, avatar, name, phone } = message
    const body = {
      name,
      email,
      avatar,
      phone,
      customerId
    }
    const {
      error,
      value
    } = await schemaValidator(body, 'User')
    if (error) {
      logger.e('error', error.message)
    }
    const user = await userRepo.addUser(value)
    console.log('user', user)
  }

  const handle = async (msg) => {
    try {
      const message = JSON.parse(msg.content.toString('utf8'))
      logger.d('message: ', message)
      await handleMessage(message)
      subscriber.ack(msg)
      setTimeout(() => {
        mediator.emit(EVENT_NAME, '')
      }, 500)
    } catch (e) {
      logger.e(e)
      jobs.push(msg)
      setTimeout(() => {
        mediator.emit(EVENT_NAME, '')
      }, 500)
    }
  }
}