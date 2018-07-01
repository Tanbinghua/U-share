const marked = require('marked')
const Comment = require('../lib/mongo').Comment

Comment.plugin('contentToHtml', {
  afterFind (comments) {
    return comments.map((comment) => {
      comment.content = marked(comment.content)
      return comment
    })
  }
})

module.exports = {
  // 创建留言
  create (comment) {
    return Comment.create(comment).exec()
  },

  // 通过id获取留言
  getCommentById (commentId) {
    return Comment.findOne({_id: commentId}).exec()
  },

  // 通过id删除留言
  delCommentById (commentId) {
    return Comment.deleteOne({_id: commentId}).exec()
  },

  // 通过文章id删除该文章所有留言
  delCommentByPostId (postId) {
    return Comment.deleteMany({postId: postId}).exec()
  },

  // 通过文章id获取该文章所有留言并排序
  getComments (postId) {
    return Comment
      .find({postId: postId})
      .populate({path: 'author', model: 'User'})
      .sort({_id: 1})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  // 通过文章id获取该文章留言数
  getCommentsCount (postId) {
    return Comment.count({postId: postId}).exec()
  }
}
