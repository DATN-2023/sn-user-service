module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const friendJoi = joi.object({
    sender: joi.string().required(),
    receiver: joi.string().required()
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
  friendSchema.index({ sender: 1, receiver: 1 }, { unique: 1 })
  const friendModel = mongoose.model('Friend', friendSchema)
  friendModel.syncIndexes()
  return friendModel
}
