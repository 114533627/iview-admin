<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form ref="loginform" @on-success-valid="handleSubmit"></login-form>
<!--          <p class="login-tip">输入任意用户名和密码即可</p>-->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo',
      'getSysEnums'
    ]),
    handleSubmit (form) {
      this.handleLogin(form).then(res => {
        this.getUserInfo().then(async (res) => {
          await this.getSysEnums()
          this.$router.push({
            name: this.$config.homeName
          })
        })
      }).catch(err => {
        console.log(err)
        this.$Message.error(err.data ? err.data : err.desc)
        this.$refs.loginform.refreshCode()
      })
    }
  }
}
</script>

<style>

</style>
