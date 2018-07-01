<template>
  <div>
    <div class="bing-like" @click="addScore"><mu-icon value="favorite_border" slot="right" :size="20"/></div>
    <mu-card class="bing-card">
      <mu-card-title :title="article.post.title" :sub-title="conInfo"></mu-card-title>
      资源简介：<mu-card-text v-html="article.post.content"></mu-card-text>
      资源链接：<a v-html="article.post.link" :href="article.post.link"></a>
      <mu-divider />
      <mu-card-header :title="article.post.author.name" :sub-title="article.post.author.bio">
        <mu-avatar :src="'/static/img/' + article.post.author.avatar" slot="avatar"/>
      </mu-card-header>
    </mu-card>
    <mu-card class="bing-card">
      <mu-card-header :sub-title="'共有 ' + article.post.commentsCount + ' 条评论'">
      </mu-card-header>
      <mu-divider />
      <mu-list>
        <mu-list-item v-for="comment in article.comments" :key="comment._id"
          :title="comment.author.name" class="bing-list">
          <mu-avatar :src="'/static/img/' + comment.author.avatar" slot="leftAvatar"/>
          <div slot="describe" v-html="comment.content" class="bing-comment"></div>
          <mu-icon value="grade" slot="right" :size="20"/>
        </mu-list-item>
      </mu-list>
    </mu-card>
    <mu-card class="bing-card" v-if="isLogin">
      <mu-card-header sub-title="发表评论"></mu-card-header>
      <mu-divider />
      <div style="text-align: center; padding-bottom: 20px;">
        <mu-text-field v-model="comment"
          label="请畅所欲言"
          hintText="支持markdown"
          :errorText="commentErr"
          multiLine :rows="3"
          labelFloat/><br/>
        <mu-raised-button label="发表" primary @click="newComment"/>
      </div>
    </mu-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      article: {
        comments: [],
        post: {
          author: {
            name: '',
            avatar: ''
          },
          commentsCount: 0,
          content: '',
          created_at: '',
          pv: 0,
          title: '',
          _id: ''
        }
      },
      isLogin: localStorage.getItem('userName'),
      comment: '',
      commentErr: ''
    }
  },
  methods: {
    getArticle () {
      const self = this
      const id = this.$route.params.id
      this.axios.get('/api/posts/' + id)
        .then((res) => {
          if (res.data.success) {
            self.article = res.data.data
          } else {
            console.log(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    addScore () {
      this.axios.get('/api/signin/inc/' + this.article.post.author.name)
        .then(res => {
          if (res.data.success) console.log(res.data.msg)
        })
        .catch(err => {
          console.log(err)
        })
    },
    newComment () {
      if (!this.comment) {
        this.commentErr = '评论不能为空'
        return
      }
      const data = {
        postId: this.article.post._id,
        content: this.comment
      }
      const self = this
      this.axios.post('/api/comments', data)
        .then((res) => {
          if (res.data.success) {
            self.comment = ''
            self.getArticle()
          } else {
            console.log('err')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  computed: {
    conInfo () {
      return '创建于:' + this.article.post.created_at +
        ' • 浏览次数:' + this.article.post.pv +
        ' • 评论人数:' + this.article.post.commentsCount +
        ' • 类型:' + this.article.post.type
    }
  },
  created () {
    this.getArticle()
  }
}
</script>

<style scoped>
.bing-card {
  margin: 20px 5px;
}

.bing-list {
  border-bottom: 1px #eee solid;
}

.bing-like {
  position: absolute;
  top: 90px;
  right: 20px;
  z-index: 1;
}
</style>
