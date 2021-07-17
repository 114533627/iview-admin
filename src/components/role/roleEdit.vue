<template>
  <div>
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="角色ID" prop="id" >
        <Input v-model="form.id" disabled style="width: 60%" placeholder="角色ID"></Input>
      </FormItem>
      <FormItem label="名称" prop="name">
        <Input v-model="form.name" style="width: 60%" placeholder="名称"></Input>
      </FormItem>
      <FormItem label="标识" prop="code">
        <Input v-model="form.code" style="width: 60%" placeholder="标识"></Input>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input v-model="form.remark" style="width: 100%" placeholder="备注"></Input>
      </FormItem>
      <FormItem label="是否默认" prop="is_default">
        <Select v-model="form.is_default" clearable style="width:200px" placeholder="是否默认">
          <Option :value="0" >否</Option>
          <Option :value="1" >是</Option>
        </Select>
      </FormItem>
      <FormItem v-show="showFooter">
        <Button type="primary" @click="handleCancel('form')">取消</Button>
        <Button @click="handleSubmit('form')" style="margin-left: 8px">确定</Button>
      </FormItem>
    </Form>

  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'RoleEdit',
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
  },
  async created () {
    this.form = { ...this.item }
  },
  mounted () {
  },
  beforeDestroy () {
  },
  data () {
    return {
      datatimeRange: [],
      form: {},
      rules: {
        // type: [{ type: 'number', required: true, message: '请选择角色类型', trigger: 'change' }],
        // img_url: [{ type: 'string', required: true, message: '请上传图片', trigger: 'blur' }],
        // name_zh: [{ required: true, message: '请输入标题', trigger: 'blur' }, { type: 'string', max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
        // name_en: [{ required: true, message: '请输入标题', trigger: 'blur' }, { type: 'string', max: 50, message: '长度不超过50个字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapMutations(['closeTag']),
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
              res = await this.$api.addRole(this.form)
            } else {
              res = await this.$api.updateRole(this.form)
            }
            console.log(res)
            if (res != null && res.code === 200) {
              this.$Message.success(this.operate === 'add' ? '添加成功' : '保存成功')
            } else {
              this.$Message.error((this.operate === 'add' ? '添加' : '保存') + `失败 ${res.desc}`)
            }
          } catch (err) {
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
