<template>
  <div>
    <mu-divider class="bing-divider"></mu-divider>
    <mu-tabs :value.sync="active" color="#7e57c2" full-width class="bing-tab">
      <mu-tab value="all" @click="changeData('all')">全部</mu-tab>
      <mu-tab value="v" @click="changeData('v')">视频</mu-tab>
      <mu-tab value="a" @click="changeData('a')">软件</mu-tab>
      <mu-tab value="d" @click="changeData('d')">文档</mu-tab>
      <mu-tab value="o" @click="changeData('o')">其他</mu-tab>
    </mu-tabs>
    <mu-list class="article" v-if="topics.length">
      <mu-list-item v-for="topic in topics" :key="topic.id" class="article-list">
        <mu-avatar :src="'/static/img/' + topic.author.avatar" slot="leftAvatar"/>
        <router-link slot="describe" class="article-describe" :to="'/content/' + topic._id">
          <p>{{ topic.title }}</p>
          <span>浏览 {{ topic.pv }}</span>
          <span>评论 {{ topic.commentsCount }}</span>
          <span>创建于 {{ topic.created_at | formatDate }}</span>
        </router-link>
        <mu-icon-menu slot="right" icon="more_vert" v-if="topic.author.name === userName">
          <mu-menu-item title="编辑" @click="$router.push('/public?id=' + topic._id)"/>
          <mu-menu-item title="删除" @click="delTopic(topic._id)" />
        </mu-icon-menu>
      </mu-list-item>
    </mu-list>
    <div v-else class="no-data">
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      topics: [],
      userName: localStorage.getItem('userName'),
      active: 'all'
    }
  },
  methods: {
    getTopics (type) {
      let url = ''
      if (type !== 'all') url = '/api/posts?type=' + type
      else url = '/api/posts'
      const self = this
      this.axios.get(url)
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
    },
    delTopic (id) {
      this.axios.get('/api/posts/' + id + '/remove').then(res => {
        if (res.data.success) {
          this.getTopics(this.active)
        } else {
          console.log(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    changeData (type) {
      this.active = type
      this.getTopics(type)
    }
  },
  created () {
    this.getTopics(this.active)
  }
}
</script>

<style scoped>
.article, loading, .no-data {
  margin-top: 48px;
}
.article-list {
  border-bottom: 1px #eee solid;
}

.article-describe {
  display: block;
  color: #aaa;
}

.article-describe p {
  font-size: 1.1rem;
  font-weight: bold;
  color: #444;
  margin: 0;
}
.no-data {
  font-size: 16px;
  text-align: center;
  color: #5c5c5c;
}
.bing-divider {
  position: fixed;
  top: 56px;
}
.bing-tab {
  position: fixed;
  top: 57px;
}
</style>
