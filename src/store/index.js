import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  TITLE: [
    ['/', 'U Share'],
    ['/article', '资源详情'],
    ['/public', '发布资源'],
    ['/public?id=', '修改资源'],
    ['/message', '论坛'],
    ['/user', '用户中心'],
    ['/user/signin', '用户登录'],
    ['/user/signup', '用户注册'],
    ['/user/signup?id=', '修改信息'],
    ['/content', '资源详情页']
  ],
  USER_INFO: {
    name: '',
    gender: '',
    bio: '',
    avatar: '',
    score: 0,
    _id: null
  }
}

export default new Vuex.Store({
  state,
  mutations
})
