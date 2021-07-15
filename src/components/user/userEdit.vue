<template>
  <div>
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="用户ID" prop="id" >
        <Input v-model="form.id" disabled style="width: 60%" placeholder="用户ID"></Input>
      </FormItem>
      <FormItem label="姓名" prop="name">
        <Input v-model="form.name" style="width: 60%" placeholder="姓名"></Input>
      </FormItem>
      <FormItem label="用户名" prop="username">
        <Input v-model="form.username" style="width: 60%" placeholder="用户名"></Input>
      </FormItem>
      <FormItem label="电话" prop="phone">
        <Input v-model="form.phone" style="width: 60%" placeholder="电话"></Input>
      </FormItem>
      <FormItem label="email" prop="email">
        <Input v-model="form.email" style="width: 60%" placeholder="email"></Input>
      </FormItem>
      <FormItem label="性别" prop="gender">
        <Select v-model="form.gender" clearable style="width:200px" placeholder="请选择用户性别">
          <Option v-for="{value,label} in genderTypeEnums" :value="value" :key="value">{{label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="头像" prop="avatar">
        <upload-media :max="1" :upload-param="{tableName: 'user',targetId: ''}" :default-list="form.avatar ? [{url: form.avatar}] : []" @uploadOver="(filelist) => uploadOverHandle(filelist,'avatar')"></upload-media>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input type="password" v-model="form.password" style="width: 60%" placeholder="密码"></Input>
      </FormItem>
      <FormItem label="确认密码" prop="repassword">
        <Input type="password" v-model="form.repassword" style="width: 60%" placeholder="确认密码"></Input>
      </FormItem>
      <FormItem v-show="showFooter">
        <Button type="primary" @click="handleCancel('form')">取消</Button>
        <Button @click="handleSubmit('form')" style="margin-left: 8px">确定</Button>
      </FormItem>
    </Form>

  </div>
</template>

<script>
import UploadMedia from '../common/UploadMedia'
import { mapGetters, mapMutations } from 'vuex'
import Editor from '_c/editor'
export default {
  name: 'UserEdit',
  components: { Editor, UploadMedia },
  props: {
    item: {
      type: Object
    },
    operate: String,
    showFooter: {
      type: Boolean,
      default: () => false
    }
  },
  watch: {
    item () {
      this.form = { ...this.item }
    }
  },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    genderTypeEnums () {
      return this.getEnumsByName('GenderType')
    }
  },
  async created () {
    this.form = { ...this.item }
    this.getUsers()
  },
  mounted () {
  },
  beforeDestroy () {
  },
  data () {
    return {
      datatimeRange: [],
      users: [],
      form: {},
      rules: {
        // type: [{ type: 'number', required: true, message: '请选择用户类型', trigger: 'change' }],
        // img_url: [{ type: 'string', required: true, message: '请上传图片', trigger: 'blur' }],
        // name_zh: [{ required: true, message: '请输入标题', trigger: 'blur' }, { type: 'string', max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
        // name_en: [{ required: true, message: '请输入标题', trigger: 'blur' }, { type: 'string', max: 50, message: '长度不超过50个字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapMutations(['closeTag']),
    uploadOverHandle (filelist, field) {
      if (filelist.length > 0) this.form[field] = filelist[0].url
      else this.form[field] = ''
    },
    changeEditorHandle (html) {
      this.form.content = html
    },
    // getOrgNameById (id) {
    //   for (let orgsKey in this.orgs) {
    //     if (this.orgs[orgsKey].value === id) return this.orgs[orgsKey].label
    //   }
    //   return id
    // },
    async getUsers () {
      try {
        let param = { page: 1, limit: 1000 }
        console.log(param)
        let res = await this.$api.getUserList(param)
        if (res.code === 200) {
          const list = res.data.map(item => {
            return {
              value: item.id,
              label: item.name_zh
            }
          })
          this.users = list
        } else {
          this.users = []
        }
      } catch (e) {
        this.$Message.error(e)
        this.users = []
      }
    },
    handleCancel () {
      console.log('cancel edit')
      if (this.showFooter) {
        this.closeTag(this.$route)
      }
    },
    handleSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            let res = null
            if (this.operate === 'add') {
              res = await this.$api.addUser(this.form)
            } else {
              res = await this.$api.updateUser(this.form)
            }
            console.log(res)
            if (res != null && res.code === 200) {
              this.$Message.success(this.operate === 'add' ? '添加成功' : '保存成功')
            } else {
              this.$Message.error((this.operate === 'add' ? '添加' : '保存') + `失败 ${res.desc}`)
            }
          } catch (e) {
            this.$Message.error((this.operate === 'add' ? '添加' : '保存') + `失败 ${e.desc}`)
          }
          if (this.showFooter) {
            this.closeTag(this.$route)
          } else {
            this.$emit('editOk')
          }
        } else {
          this.$Message.info('表单校验未通过，请检查')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
