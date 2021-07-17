<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="username">
      <Input v-model="form.username" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="code">
      <Input class="login-code" type="text" v-model="form.code" placeholder="请输入验证码" >
        <span slot="prepend">
          <Icon :size="14" type="ios-code"></Icon>
        </span>
        <span slot="append" @click="refreshCode">
          <img :src="code.src" class="code-img">
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import axios from '@/libs/api.request'
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    codeRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        username: '',
        password: '',
        code: '',
        randomStr: ''
      },
      code: {
        src: '',
        value: '',
        len: 4,
        type: 'image'
      }
    }
  },
  created () {
    this.refreshCode()
  },
  computed: {
    rules () {
      return {
        username: this.userNameRules,
        password: this.passwordRules,
        code: this.codeRules
      }
    }
  },
  methods: {
    refreshCode () {
      this.form.code = ''
      this.form.randomStr = new Date().getTime()
      this.code.src = axios.baseUrl + `/v1/code/${this.form.randomStr}`
    },
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', this.form)
        }
      })
    }
  }
}
</script>
<style scoped>
  .code-img {

  }
  .login-code >>> .ivu-input-inner-container,.login-code >>>  .ivu-input-inner-container .ivu-input  {
    height: 62px;
  }
</style>
