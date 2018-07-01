const User = require('../lib/mongo').User

module.exports = {
  // 新建用户
  create (user) {
    return User.create(user).exec()
  },
  // 根据用户名获取用户信息
  getUserByName (name) {
    return User
      .findOne({name: name})
      .addCreatedAt()
      .exec()
  },
  
  // 通过用户名给score加1
  incScore (name) {
    return User
      .update({name: name}, {$inc: {score: 100}})
      .exec()
  },

  updateUserByName (userId, data) {
    return User.update({_id: userId}, {$set: data}).exec()
  }
}
