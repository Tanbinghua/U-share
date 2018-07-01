const config = require('../config')
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.dev.mongodb, {useNewUrlParser: true})

const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

mongolass.plugin('addCreatedAt', {
  afterFind (results) {
    results.forEach(element => {
      element.created_at = moment(objectIdToTimestamp(element._id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  },
  afterFindOne (results) {
    if (results) {
      results.created_at = moment(objectIdToTimestamp(results._id)).format('YYYY-MM-DD HH:mm')
    }
    return results
  }
})

exports.User = mongolass.model('User', {
  name: {type: 'string', required: true},
  password: {type: 'string', required: true},
  avatar: {type: 'string', required: true},
  gender: {type: 'string', enum: ['m', 'f', 'x'], default: 'x'},
  bio: {type: 'string', required: true},
  score: {type: 'number', default: 0}
})
exports.User.index({name: 1}, {unique: true}).exec()

exports.Post = mongolass.model('Post', {
  type: {type: 'string', enum: ['v', 'a', 'd', 'o'], default: 'o'},
  link: {type: 'string', required: true},
  author: {type: Mongolass.Types.ObjectId, required: true},
  title: {type: 'string', required: true},
  content: {type: 'string', required: true},
  pv: {type: 'number', default: 0}
})
exports.Post.index({author: 1, _id: -1}).exec()

exports.Comment = mongolass.model('Comment', {
  author: {type: Mongolass.Types.ObjectId, required: true},
  content: {type: 'string', required: true},
  postId: {type: Mongolass.Types.ObjectId, required: true}
})
exports.Comment.index({postId: 1, _id: 1}).exec()
