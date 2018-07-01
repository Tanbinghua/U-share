module.exports = {
  // 判断是否登录
  checkLogin (req, res, next) {
    if (!req.session.user) {
      const data = {
        success: false,
        msg: '未登录'
      }
      return res.json(data)
    }
    next()
  },

  // 判断是否已登录
  checkNotLogin (req, res, next) {
    if (req.session.user) {
      const data = {
        success: false,
        msg: '已登录'
      }
      return res.json(data)
    }
    next()
  }
}
