<template>
  <div class="header">
    <mu-appbar :title="title" class="title">
      <mu-icon-button v-if="!isContent" icon="account_circle"
        slot="left" @click="drawerToggle(true)"/>
      <mu-icon-button v-else icon="arrow_back"
        slot="left" @click="goBack"></mu-icon-button>
      <mu-icon-button icon="search" @click="drawerRight(true)" slot="right"/>
    </mu-appbar>
    <mu-drawer :open="open" :docked="docked" @close="drawerToggle()">
      <div class="bing-drawer">
        <img :src="'/static/img/' + $store.state.USER_INFO.avatar" class="bing-avatar"/>
        <mu-raised-button label="修改个人信息" primary @click="changeInfo" style="width: 90%; margin-top: 20px;"/>
      </div>
    </mu-drawer>
    <mu-drawer :open="search" :docked="right" @close="drawerRight()" right width="100%">
      <div class="search-drawer">
        <mu-text-field v-model="searchVal" label="请输入查询参数"
          label-float @keyup.enter.native="getData"></mu-text-field>
        <mu-icon-button icon="search" @click="getData"/>
        <mu-raised-button class="search-btn" label="关闭" primary @click="search = false"/>
        <ul>
          <li class="search-list" v-for="item in topics" :key="item.id"
            @click="jumpTo(item._id)">{{ item.title }}</li>
        </ul>
      </div>
    </mu-drawer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      titleMap: new Map(this.$store.state.TITLE),
      open: false,
      docked: true,
      search: false,
      right: false,
      searchVal: '',
      topics: []
    }
  },
  methods: {
    drawerToggle (flag) {
      this.open = !this.open
      this.docked = !flag
    },
    drawerRight (flag) {
      this.search = !this.search
      this.right = !flag
    },
    goBack () {
      this.$router.go(-1)
    },
    changeInfo () {
      this.open = false
      this.$router.push({path: '/user/signup', query: {id: this.$store.state.USER_INFO._id}})
    },
    getData () {
      if (this.searchVal !== '') {
        const self = this
        this.axios.get('/api/posts?title=' + this.searchVal)
          .then((res) => {
            if (res.data.success) {
              self.topics = res.data.data
            } else {
              console.log(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        console.log('无请求')
      }
    },
    jumpTo (id) {
      this.search = false
      this.searchVal = ''
      this.topics = []
      this.$router.push('/content/' + id)
    }
  },
  computed: {
    title () {
      const str = this.$route.path
      if (str.substring(0, str.lastIndexOf('/')) === '/content') {
        return this.titleMap.get('/content')
      }
      if (this.$route.fullPath.indexOf('/public?id=') !== -1) {
        return this.titleMap.get('/public?id=')
      }
      if (this.$route.fullPath.indexOf('/user/signup?id=') !== -1) {
        return this.titleMap.get('/user/signup?id=')
      }
      return this.titleMap.get(str)
    },
    isContent () {
      const str = this.$route.path
      return str.indexOf('/content') !== -1 ||
        str.indexOf('/search') !== -1
    }
  }
}
</script>

<style scoped>
.title {
  position: fixed;
  text-align: center;
}
.bing-drawer{
  margin-top: 20px;
  text-align: center;
}
.search-drawer {
  margin-top: 10px;
  text-align: center;
  padding: 0 0 0 10px;
}
.search-btn {
  position: absolute;
  bottom: 20px;
  right: 40px;
}
ul {
  padding: 0;
}
.search-list {
  list-style: none;
  text-align: left;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 0;
  padding: 10px;
  width: 95%;
}
</style>
