import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: _import('Home'),
      children: [
        { path: '/', name: 'Articles', component: _import('Articles') },
        { path: '/content/:id', name: 'Content', component: _import('Content') },
        {
          path: '/user',
          component: _import('User'),
          children: [
            { path: '/user', name: 'Info', component: _import('Info') },
            { path: '/user/signup', name: 'Signup', component: _import('Signup') },
            { path: '/user/signin', name: 'Signin', component: _import('Signin') }
          ]
        },
        { path: '/public', name: 'Public', component: _import('Public') },
        { path: '/message', name: 'Message', component: _import('Message') }
      ]
    }
  ]
})
