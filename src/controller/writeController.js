module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Friend
    }
  } = container.resolve('models')
  const {
    httpCode,
    serverHelper,
    workerConfigNoti
  } = container.resolve('config')
  const {
    userRepo,
    friendRepo
  } = container.resolve('repo')
  const publisher = container.resolve('publisher')
  const typeConfig = {
    COMMENT: 1,
    REACT: 2,
    POST: 3,
    SHARE: 4,
    FOLLOW: 5,
    UNREACT: 6,
    UNFOLLOW: 7
  }
  const addUser = async (req, res) => {
    try {
      const user = req.body
      const {
        error,
        value
      } = await schemaValidator(user, 'User')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      const sp = await userRepo.addUser(value)
      res.status(httpCode.CREATED).send(sp)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const deleteUser = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        await userRepo.deleteUser(id)
        res.status(httpCode.SUCCESS).send({ ok: true })
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const updateUser = async (req, res) => {
    try {
      const { id } = req.params
      const user = req.body
      const {
        error,
        value
      } = await schemaValidator(user, 'User')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      if (id && user) {
        const sp = await userRepo.updateUser(id, value)
        res.status(httpCode.SUCCESS).send(sp)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const updateTotalFeed = async (req, res) => {
    try {
      const { id } = req.params
      const { isAdd } = req.body
      if (id) {
        if (isAdd) {
          await userRepo.findOneAndUpdate({ customerId: new ObjectId(id) }, { $inc: { feedTotal: 1 } })
        } else {
          await userRepo.findOneAndUpdate({ customerId: new ObjectId(id) }, { $inc: { feedTotal: -1 } })
        }
        res.status(httpCode.SUCCESS).send({ ok: true })
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const addFriend = async (req, res) => {
    try {
      const friend = req.body
      const {
        error,
        value
      } = await schemaValidator(friend, 'Friend')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      const sp = await friendRepo.addFriend(value)
      await userRepo.findOneAndUpdate({ customerId: new ObjectId(sp.sender.toString()) }, { $inc: { followeeTotal: 1 } })
      await userRepo.findOneAndUpdate({ customerId: new ObjectId(sp.receiver.toString()) }, { $inc: { followerTotal: 1 } })
      const payload = {
        user: sp.sender.toString(),
        alertUser: sp.receiver.toString(),
        type: typeConfig.FOLLOW
      }
      await publisher.sendToQueue(payload, workerConfigNoti.queueName)
      res.status(httpCode.CREATED).send(sp)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const deleteFriend = async (req, res) => {
    try {
      const { id } = req.params
      if (id) {
        const sp = await friendRepo.findOneAndRemove({ _id: new ObjectId(id) })
        await userRepo.findOneAndUpdate({ customerId: new ObjectId(sp.sender.toString()) }, { $inc: { followeeTotal: -1 } })
        await userRepo.findOneAndUpdate({ customerId: new ObjectId(sp.receiver.toString()) }, { $inc: { followerTotal: -1 } })
        const payload = {
          user: sp.sender.toString(),
          alertUser: sp.receiver.toString(),
          type: typeConfig.UNFOLLOW
        }
        await publisher.sendToQueue(payload, workerConfigNoti.queueName)
        res.status(httpCode.SUCCESS).send({ ok: true })
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const updateFriend = async (req, res) => {
    try {
      const { id } = req.params
      const friend = req.body
      const {
        error,
        value
      } = await schemaValidator(friend, 'Friend')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      if (id && friend) {
        const sp = await friendRepo.updateFriend(id, value)
        res.status(httpCode.SUCCESS).send(sp)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }

  return {
    addUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend,
    updateFriend,
    updateTotalFeed
  }
}
