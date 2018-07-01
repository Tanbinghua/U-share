import router from './router'
import store from './store'
import axios from 'axios'

router.beforeEach((to, from, next) => {
  if (to.path === '/user') {
    let logstate = false
    axios.get('/api/signin/logstate').then((res) => {
      logstate = res.data.success
      if (localStorage.getItem('userName') && logstate) {
        let userName = localStorage.getItem('userName')
        if (!store.state.USER_INFO.name) {
          axios.get('/api/signin/user/' + userName).then((res) => {
            if (res.data.success) {
              store.commit({
                type: 'setUserInfo',
                info: JSON.stringify(res.data.data)
              })
            } else {
              console.log('Permission')
            }
          }).catch((err) => {
            console.log(`Permission: ${err}`)
          })
        }
        next()
      } else {
        if (logstate) axios.get('/api/signout')
        next('/user/signin')
      }
    }).catch((err) => {
      console.log(`Permission: ${err}`)
    })
  } else if (to.path === '/user/signin') {
    let logstate = true
    axios.get('/api/signin/logstate').then((res) => {
      logstate = res.data.success
      if (localStorage.getItem('userName')) {
        if (logstate) next('/user')
        else {
          localStorage.removeItem('userName')
          next()
        }
      } else {
        if (logstate) axios.get('/api/signout')
        next()
      }
    })
  } else {
    next()
  }
})
