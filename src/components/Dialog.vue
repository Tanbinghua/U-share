<template>
  <mu-dialog :open="dialog" title="提示">
    尚未登录，请登陆
    <mu-flat-button slot="actions" @click="cancel" primary label="取消"/>
    <mu-flat-button slot="actions" @click="signin" primary label="确定"/>
  </mu-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialog: true
    }
  },
  methods: {
    cancel () {
      this.dialog = false
      this.$router.push('/')
    },
    signin () {
      this.dialog = false
      this.$router.push('/user/signin')
    }
  }
}
</script>
