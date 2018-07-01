const express = require('express')
const router = express.Router()

const PostModel = require('../models/posts')
const CommentModel = require('../models/comment')
const checkLogin = require('../middlewares/check').checkLogin

router.get('/', (req, res, next) => {
  if (req.query.title) {
    const params = req.query.title
    PostModel.getPostsByParams(params)
    .then((posts) => {
      posts.forEach(item => {
        delete item.author.password
        delete item.author.bio
        delete item.author.gender
        delete item.author._id
        delete item.content
      })
      let responseMsg = {success: true, msg: '获取列表成功'}
      responseMsg.data = posts
      res.jsonp(responseMsg)
    })
    .catch(next)
  } else {
    const data = {
      author: req.query.author,
      type: req.query.type
    }

    PostModel.getPosts(data)
      .then((posts) => {
        posts.forEach(item => {
          delete item.author.password
          delete item.author.bio
          delete item.author.gender
          delete item.author._id
          delete item.content
        })
        let responseMsg = {success: true, msg: '获取列表成功'}
        responseMsg.data = posts
        res.jsonp(responseMsg)
      })
      .catch(next)
  }
})

// POST /posts/create 发表文章
router.post('/create', checkLogin, (req, res, next) => {
  const author = req.session.user._id
  const title = req.fields.title
  const content = req.fields.content
  const type = req.fields.type
  const link = req.fields.link

  let post = {
    author: author,
    title: title,
    content: content,
    type: type,
    link: link
  }

  PostModel.create(post)
    .then((result) => {
      // 此post是插入mongodb后的值，包含_id
      // post = result.ops[0]
      if (!post) return
      res.jsonp({success: true, msg: '发表成功'})
    })
    .catch(next)
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', (req, res, next) => {
  const postId = req.params.postId

  Promise.all([
    PostModel.getPostById(postId),
    CommentModel.getComments(postId),
    PostModel.incPv(postId)
  ])
    .then((result) => {
      const post = result[0]
      const comments = result[1]
      if (!post) {
        throw new Error('文章不存在')
      }

      const article = {
        post: post,
        comments: comments
      }
      article.comments.forEach((item) => {
        delete item.author.password
        delete item.author.bio
        delete item.author.gender
      })
      delete article.post.author.password
      delete article.post.author._id
      let responseMsg = {success: true, msg: '获取成功'}
      responseMsg.data = article
      res.json(responseMsg)
    })
    .catch(next)
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, (req, res, next) => {
  const postId = req.params.postId
  const author = req.session.user._id

  PostModel.getRawPostById(postId)
    .then((post) => {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (author.toString() !== post.author._id.toString()) {
        throw new Error('权限不足')
      }
      const resPost = post
      res.jsonp({success: true, msg: '获取成功', data: resPost})
    })
    .catch(next)
})

// POST /posts/:postId/edit 更新文章
router.post('/:postId/edit', checkLogin, (req, res, next) => {
  const postId = req.params.postId
  const author = req.session.user._id
  const title = req.fields.title
  const content = req.fields.content
  const link = req.fields.link
  const type = req.files.type

  PostModel.getRawPostById(postId)
    .then((post) => {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('权限不足')
      }
      PostModel.updatePostById(postId, {title: title, content: content, link: link, type: type})
        .then(() => {
          res.jsonp({success: true, msg: '编辑成功'})
        })
        .catch(next)
    })
})

// GET //posts/:postId/remove 删除文章
router.get('/:postId/remove', checkLogin, (req, res, next) => {
  const postId = req.params.postId
  const author = req.session.user._id

  PostModel.getRawPostById(postId)
    .then((post) => {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author._id.toString() !== author.toString()) {
        throw new Error('权限不足')
      }
      PostModel.delPostById(postId)
        .then(() => {
          res.jsonp({success: true, msg: '删除成功'})
        })
        .catch(next)
    })
    .catch(next)
})

module.exports = router
