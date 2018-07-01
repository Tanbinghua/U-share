<template>
  <div class="signin">
    <form enctype="multipart/form-data">
      <mu-text-field v-model="name" hintText="请输入你的账号" label="账号"
      labelFloat required @blur="accountBlur" :errorText="accountErr"/><br/>
      <mu-text-field v-model="password" type="password" hintText="请输入你的密码"
      label="密码" labelFloat required  @blur="passwordBlur" :errorText="passwordErr"/><br/>
      <mu-raised-button label="登录" primary @click="logIn" style="width: 100%; margin-top: 20px;"/>
    </form>
    <div class="bing-btn">
      <mu-flat-button label="注册" to="/user/signup" primary/>
    </div>
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
      resMsg: null,
      accountErr: '',
      passwordErr: '',
      openSimple: false
    }
  },
  methods: {
    logIn () {
      if (!this.name || !this.password) {
        console.log('error')
      } else {
        const self = this
        this.axios.post('/api/signin', {
          name: self.name,
          password: self.password
        })
          .then((res) => {
            if (res.data.success) {
              localStorage.setItem('userName', res.data.data.name)
              this.$router.push('/user')
            } else {
              this.resMsg = res.data.msg
              this.openSimple = true
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    accountBlur () {
      this.accountErr = this.name ? '' : '账号不能为空'
    },
    passwordBlur () {
      this.passwordErr = this.password ? '' : '密码不能为空'
    }
  }
}
</script>

<style scoped>
.signin {
  width: 70%;
  margin: 20px auto;
}
.bing-btn {
  width: 100%;
  text-align: end;
  padding-top: 10px;
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
</style>
