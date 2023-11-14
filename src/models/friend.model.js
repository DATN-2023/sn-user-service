module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const friendRequestConfig = {
    PENDING: 1,
    ACCEPT: 2,
    UNFRIEND: 3
  }
  const friendJoi = joi.object({
    sender: joi.string().required(),
    receiver: joi.string().required(),
    type: joi.number().valid(...Object.values(friendRequestConfig)).required(),
  })
  const friendSchema = joi2MongoSchema(friendJoi, {}, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    },
    sender: {
      type: ObjectId,
      ref: 'User'
    },
    receiver: {
      type: ObjectId,
      ref: 'User'
    }
  })
  friendSchema.statics.validateObj = (obj, config = {}) => {
    return friendJoi.validate(obj, config)
  }
  friendSchema.statics.validateTaiLieu = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return friendJoi.validate(obj, config)
  }
  friendSchema.statics.getConfig = () => {
    return { friendRequestConfig }
  }
  friendSchema.index({ sender: 1, receiver: 1 }, { unique: 1 })
  const friendModel = mongoose.model('Friend', friendSchema)
  friendModel.syncIndexes()
  return friendModel
}
