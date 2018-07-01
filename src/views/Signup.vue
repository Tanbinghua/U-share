<template>
  <div class="signup">
    <form enctype="multipart/form-data">
      <mu-text-field v-model="name" hintText="请填写账号" label="账号"
        labelFloat @blur="accountBlur" :errorText="accountErr" v-if="!$route.query.id"/><br/>
      <mu-text-field v-model="password" type="password" hintText="请填写密码"
        label="密码" labelFloat @blur="passwordBlur" :errorText="passwordErr"/><br/>
      <mu-text-field v-model="repassword" type="password" hintText="请再次输入密码"
        label="确认密码" labelFloat @blur="repasswordBlur" :errorText="repasswordErr"/><br/>
      <mu-select-field v-model="sexValue" label="请选择你的性别">
        <mu-menu-item value="m" title="男"/>
        <mu-menu-item value="f" title="女"/>
        <mu-menu-item value="x" title="保密"/>
      </mu-select-field><br/>
      <mu-text-field v-model="bio"
        label="请填写你的个人简介"
        hintText="不超过50个字符"
        @blur="inputBlur"
        :errorText="inputErrorText"
        @textOverflow="handleOverflow"
        multiLine :rows="3" :maxrows="6"
        :maxLength="50" labelFloat/><br/>
    </form>
    <form action="/api/signup/img" method="post" enctype="multipart/form-data"
      ref="imgForm" class="bing-upload" target="iframe">
      <input type="file" name="avatar" id="imgChoose"
        @change="getAvatar" ref="file" style="display: none"/>
      <label for="imgChoose"></label>
      <img :src="src" alt="User avatar" v-if="src" class="bing-avatar">
      <p v-if="!src" style="color: #ccc;">请选择你的头像</p>
      <mu-float-button icon="add" mini v-if="!src"/>
    </form>
    <iframe id="frame" name="iframe" style="display: none;"></iframe>
    <mu-raised-button :label="this.$route.query.id ? '修改' : '提交'" primary @click="newUser"
      style="width: 100%; margin-top: 20px;"/>
    <mu-dialog title="提示信息" width="360" :open.sync="openSimple">
      {{ resMsg }}
      <button class="sure-btn" slot="actions" flat @click="openSimple = false">确定</button>
    </mu-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      password: '',
      repassword: '',
      sexValue: 'x',
      accountErr: null,
      passwordErr: null,
      repasswordErr: null,
      inputErrorText: null,
      bio: '',
      src: '',
      resMsg: null,
      inputErrorFlag: false,
      imgPutFlag: false,
      openSimple: false
    }
  },
  methods: {
    getData () {
      this.name = this.$store.state.USER_INFO.name
      this.sexValue = this.$store.state.USER_INFO.gender
      this.bio = this.$store.state.USER_INFO.bio
    },
    changeSex (val) {
      this.sexValue = val
    },
    accountBlur () {
      this.accountErr = this.name ? '' : '账号不能为空'
    },
    passwordBlur () {
      this.passwordErr = this.password ? '' : '密码不能为空'
    },
    repasswordBlur () {
      if (!this.repassword) this.repasswordErr = '确认密码不能为空'
      else {
        if (this.password !== this.repassword) this.repasswordErr = '两次密码不一致'
        else this.repasswordErr = ''
      }
    },
    inputBlur () {
      this.inputErrorText = this.bio ? '' : '个人简介不能为空'
    },
    handleOverflow (isOverflow) {
      if (isOverflow) {
        this.inputErrorFlag = true
        this.inputErrorText = '超出最长字符个数'
      }
    },
    getAvatar (e) {
      const self = this
      if (!e || !window.FileReader) return
      const files = e.target.files[0]
      if (!files) return
      let reader = new FileReader()
      reader.readAsDataURL(files)
      reader.onloadend = function () {
        self.src = this.result
      }
      this.$refs.imgForm.submit()
      this.imgPutFlag = true
    },
    newUser () {
      if (!this.name || !this.password || !this.repassword || !this.bio) {
        console.log('error')
      } else {
        const self = this
        let url = '/api/signup'
        if (this.$route.query.id) url = '/api/signup/' + this.$route.query.id + '/edit'
        this.axios.post(url, {
          name: self.name,
          password: self.password,
          repassword: self.repassword,
          gender: self.sexValue,
          bio: self.bio
        })
          .then((res) => {
            if (res.data.success) {
              if (res.data.data) localStorage.setItem('userName', res.data.data.name)
              this.$router.push('/')
            } else {
              this.resMsg = res.data.msg
              this.openSimple = true
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  },
  mounted () {
    if (this.$route.query.id) this.getData()
  }
}
</script>

<style scoped>
.signup {
  width: 70%;
  margin: 20px auto;
}
.bing-radio {
  margin-bottom: 16px;
}
.bing-upload {
  position: relative;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  overflow: hidden;
}
.bing-upload label {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}
.bing-upload img {
  width: 100%;
}
.sure-btn {
  background-color: #7e57c2;
  color: #fff;
  border-radius: 2px;
  height: 36px;
  line-height: 36px;
  transform: translateZ(0);
  text-decoration: none;
  text-transform: uppercase;
  border: none;
  box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
}
.bing-avatar {
  width: 66px;
}
</style>
