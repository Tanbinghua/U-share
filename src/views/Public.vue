<template>
  <div class="public">
    <Dialog v-if="!isLogin"></Dialog>
    <div class="form" v-else>
      <form enctype="multipart/form-data">
        <mu-select-field v-model="type" label="请选择资源类型">
          <mu-menu-item value="v" title="视频"/>
          <mu-menu-item value="a" title="软件"/>
          <mu-menu-item value="d" title="文档"/>
          <mu-menu-item value="o" title="其他"/>
        </mu-select-field><br/>
        <mu-text-field v-model="title" hintText="请填写资源标题" label="标题"
          labelFloat @blur="titleBlur" :errorText="titleErr"/><br/>
        <mu-text-field v-model="link" hintText="请填写资源链接" label="链接"
          labelFloat @blur="linkBlur" :errorText="linkErr"/><br/>
        <mu-text-field v-model="content"
          label="请填写资源简介"
          hintText="支持markdown"
          @blur="contentBlur"
          :errorText="contentErr"
          multiLine :rows="6"
          labelFloat/><br/>
      </form>
      <mu-raised-button :label="$route.query.id ? '修改' : '提交'" primary @click="newPost"
        style="width: 100%; margin-top: 20px;"/>
    </div>
  </div>
</template>

<script>
import Dialog from '../components/Dialog'

export default {
  data () {
    return {
      title: null,
      link: null,
      content: null,
      titleErr: null,
      linkErr: null,
      contentErr: null,
      type: 'o',
      isLogin: localStorage.getItem('userName')
    }
  },
  components: {
    Dialog
  },
  methods: {
    titleBlur () {
      this.titleErr = this.title ? '' : '请填写文章标题'
    },
    contentBlur () {
      this.contentErr = this.content ? '' : '请畅所欲言'
    },
    linkBlur () {
      this.linkErr = this.link ? '' : '请填写资源链接'
    },
    getData () {
      const self = this
      const id = this.$route.query.id
      this.axios.get('/api/posts/' + id + '/edit')
        .then((res) => {
          if (res.data.success) {
            self.title = res.data.data.title
            self.link = res.data.data.link
            self.type = res.data.data.type
            self.content = res.data.data.content
          } else {
            console.log(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    newPost () {
      if (!this.title || !this.content || !this.link || !this.type) {
        console.log('error')
      } else {
        const self = this
        let url = 'api/posts/create'
        if (this.$route.query.id) url = 'api/posts/' + this.$route.query.id + '/edit'
        this.axios.post(url, {
          title: self.title,
          content: self.content,
          link: self.link,
          type: self.type
        })
          .then((res) => {
            if (res.data.success) {
              console.log(res.data.msg)
              this.$router.push('/')
            } else {
              console.log(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err)
          })
        this.$router.push('/')
      }
    }
  },
  mounted () {
    if (this.$route.query.id) this.getData()
  }
}
</script>

<style scoped>
.public {
  width: 70%;
  margin: 20px auto;
}
</style>
