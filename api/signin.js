const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkLogin = require('../middlewares/check').checkNotLogin

// POST /signin 用户登录
router.post('/', checkLogin, (req, res, next) => {
  const name = req.fields.name
  const password = req.fields.password

  UserModel.getUserByName(name)
    .then((user) => {
      if (!user) {
        return res.json({success: false, msg: '用户不存在'})
      }
      if (sha1(password) !== user.password) {
        return res.json({success: false, msg: '用户名或密码错误'})
      }
      delete user.password
      req.session.user = user
      let responseMsg = {success: true, msg: '登录成功'}
      responseMsg.data = user
      res.json(responseMsg)
    })
    .catch(next)
})

router.get('/user/:user', (req, res, next) => {
  const name = req.params.user

  UserModel.getUserByName(name)
    .then((user) => {
      if (!user) {
        return res.json({success: false, msg: '用户不存在'})
      }
      delete user.password
      let responseMsg = {success: true, msg: 'OK'}
      responseMsg.data = user
      res.json(responseMsg)
    })
    .catch(next)
})

router.get('/logstate', (req, res, next) => {
  if (!req.session.user) {
    res.json({success: false, msg: '未登录'})
  } else {
    res.json({success: true, msg: '已登录'})
  }
})

router.get('/inc/:userName', (req, res, next) => {
  const userName = req.params.userName
  UserModel.incScore(userName).then(() => {
    res.jsonp({success: true, msg: '成功加分'})
  })
})

module.exports = router
