module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Friend } = schemas
  const addFriend = (cate) => {
    const c = new Friend(cate)
    return c.save()
  }
  const getFriendById = (id) => {
    return Friend.findById(id)
  }
  const deleteFriend = (id) => {
    return Friend.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateFriend = (id, n) => {
    return Friend.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Friend.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Friend.countDocuments(pipe)
  }
  const getFriendAgg = (pipe) => {
    return Friend.aggregate(pipe)
  }
  const getFriend = (pipe, limit, skip, sort) => {
    return Friend.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getFriendNoPaging = (pipe) => {
    return Friend.find(pipe)
  }
  const removeFriend = (pipe) => {
    return Friend.deleteMany(pipe)
  }
  const findOne = (pipe) => {
    return Friend.findOne(pipe)
  }
  const findOneAndRemove = (pipe) => {
    return Friend.where().findOneAndRemove(pipe)
  }
  return {
    getFriendNoPaging,
    removeFriend,
    addFriend,
    getFriendAgg,
    getFriendById,
    deleteFriend,
    updateFriend,
    checkIdExist,
    getCount,
    getFriend,
    findOne,
    findOneAndRemove
  }
}
