const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

router.get('/', checkLogin, (req, res, next) => {
  req.session.user = null
  res.json({success: true, data: '注销成功'})
})

module.exports = router
