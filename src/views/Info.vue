<template>
  <mu-card class="info">
    <img :src="'/static/img/' + user_info.avatar" class="bing-avatar"/>
    <h3>用户名：{{ user_info.name }}</h3>
    <p>性别：<mu-icon :class="{boy: boy, girl: girl}" value="accessibility"/></p>
    <p>用户简介：{{ user_info.bio }}</p>
    <p>用户积分：{{ user_info.score }}</p>
    <mu-raised-button label="注销" primary @click="logOut" style="width: 100%; margin-top: 20px;"/>
  </mu-card>
</template>

<script>
export default {
  data () {
    return {
      user_info: this.$store.state.USER_INFO,
      boy: this.$store.state.USER_INFO.gender === 'm',
      girl: this.$store.state.USER_INFO.gender === 'f'
    }
  },
  methods: {
    logOut () {
      const self = this
      this.axios.get('/api/signout')
        .then((res) => {
          localStorage.removeItem('userName')
          self.user_info = {}
          this.$store.commit({
            type: 'setUserInfo',
            info: JSON.stringify({})
          })
          this.$router.push('/')
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style>
.info {
  padding: 20px;
  text-align: center;
}
.boy {
  color: skyblue;
}
.girl {
  color: pink;
}
.bing-avatar {
  width: 66px;
  border-radius: 50%;
}
</style>
