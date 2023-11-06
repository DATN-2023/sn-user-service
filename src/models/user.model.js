module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const userJoi = joi.object({
    name: joi.string().required(),
    avatar: joi.string().required(),
    email: joi.string().required(),
    phone: joi.string().required(),
    place: joi.string().default('').allow(''),
    banner: joi.string().default('').allow(''),
    feedTotal: joi.number().default(0),
    friendTotal: joi.number().default(0),
    description: joi.string().default(),
    dob: joi.number().required()
  })
  const userSchema = joi2MongoSchema(userJoi, {}, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  userSchema.statics.validateObj = (obj, config = {}) => {
    return userJoi.validate(obj, config)
  }
  userSchema.statics.validateTaiLieu = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return userJoi.validate(obj, config)
  }
  const userModel = mongoose.model('User', userSchema)
  userModel.syncIndexes()
  return userModel
}
