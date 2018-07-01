const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin
const checkLogin = require('../middlewares/check').checkLogin

let user = {
  name: '',
  password: '',
  gender: '',
  bio: '',
  avatar: '',
  path: ''
}

router.post('/', checkNotLogin, (req, res, next) => {
  user.name = req.fields.name
  user.password = sha1(req.fields.password)
  user.gender = req.fields.gender
  user.bio = req.fields.bio
  UserModel.create(user)
    .then((result) => {
      user = result.ops[0]
      delete user.password
      req.session.user = user
      let responseMsg = {success: true, msg: '注册成功'}
      responseMsg.data = user
      res.json(responseMsg)
    })
    .catch((err) => {
      fs.unlink(user.path)
      if (err.message.match('duplicate key')) {
        return res.json({success: false, msg: '用户名被占用'})
      }
      next()
    })
})

router.post('/:userId/edit', checkLogin, (req, res, next) => {
  const userId = req.params.userId
  user.name = req.fields.name
  user.password = sha1(req.fields.password)
  user.gender = req.fields.gender
  user.bio = req.fields.bio
  UserModel.getUserByName(user.name)
    .then((oldUser) => {
      if (!oldUser) throw new Error('用户不存在')
      UserModel.updateUserByName(userId, {
        name: user.name,
        password: user.password,
        gender: user.gender,
        bio: user.bio,
        avatar: user.avatar
      }).then((result) => {
        res.jsonp({success: true, msg: '修改成功', data: user})
      }).catch(next)
    })
})

router.post('/img', (req, res, next) => {
  user.path = req.files.avatar.path
  user.avatar = req.files.avatar.path.split(path.sep).pop()
  res.json({success: true, msg: '上传成功'})
})

module.exports = router
