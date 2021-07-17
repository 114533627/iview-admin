<template>
  <div>
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="用户ID" prop="id">
        <Input v-model="form.id" disabled style="width: 60%" placeholder="用户ID"></Input>
      </FormItem>
      <FormItem label="姓名" prop="username">
        <Input v-model="form.username" style="width: 60%" disabled placeholder="姓名"></Input>
      </FormItem>
      <FormItem>
        <CheckboxGroup v-model="roleNames">
          <Checkbox v-for="item in roles" :label="item.label" :key="item.value" border></Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem v-show="showFooter">
        <Button type="primary" @click="handleCancel('form')">取消</Button>
        <Button @click="handleSubmit('form')" style="margin-left: 8px">确定</Button>
      </FormItem>
    </Form>

  </div>
</template>

<script>
export default {
  name: 'UserRole',
  components: {},
  props: {
    item: {
      type: Object
    },
    showFooter: {
      type: Boolean,
      default: () => false
    }
  },
  watch: {
    item () {
      this.form = { ...this.item }
      this.roleNames = this.item && this.item.roles ? this.item.roles.map(item => item.name) : []
    }
  },
  computed: {},
  async created () {
    this.form = { ...this.item }
    this.roleNames = this.item && this.item.roles ? this.item.roles.map(item => item.name) : []
    this.getRoles()
  },
  mounted () {
  },
  beforeDestroy () {
  },
  data () {
    return {
      roles: [],
      form: {},
      roleNames: [],
      rules: {}
    }
  },
  methods: {
    async getRoles () {
      try {
        let param = { page: 1, limit: 1000 }
        console.log(param)
        let res = await this.$api.getRoleList(param)
        if (res.code === 200) {
          const list = res.data.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
          this.roles = list
        } else {
          this.roles = []
        }
      } catch (err) {
        this.$Message.error(err && err.desc ? err.desc : err)
        this.roles = []
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
            let params = {
              user_id: this.form.id,
              role_ids: this.roles.filter(item => this.roleNames.includes(item.label)).map(item => item.value)
            }
            let res = await this.$api.saveUserRole(params)

            if (res != null && res.code === 200) {
              this.$Message.success('保存成功')
            } else {
              this.$Message.error(`保存失败 ${res.desc}`)
            }
          } catch (res) {
            this.$Message.error(`保存失败 ${res.desc}`)
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
