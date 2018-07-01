const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const CommentModel = require('../models/comment')

// POST /comments创建留言
router.post('/', checkLogin, (req, res, next) => {
  const author = req.session.user._id
  const postId = req.fields.postId
  const content = req.fields.content

  const comment = {
    author: author,
    postId: postId,
    content: content
  }

  CommentModel.create(comment)
    .then(() => {
      res.json({success: true, msg: '留言成功'})
    })
    .catch(next)
})

router.get('/:commentId/remove', checkLogin, (req, res, next) => {
  const author = req.session.user._id
  const commentId = req.params.commentId

  CommentModel.getCommentById(commentId)
    .then((comment) => {
      if (!comment) {
        throw new Error('留言不存在')
      }
      if (comment.author.toString() !== author.toString()) {
        throw new Error('没有权限')
      }
      CommentModel.delCommentById(commentId)
        .then(() => {
          req.flash('success', '删除成功')
          res.redirect('back')
        })
        .catch(next)
    })
    .catch(next)
})

module.exports = router
