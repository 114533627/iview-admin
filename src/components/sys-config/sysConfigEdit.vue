<template>
  <div>
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="配置ID" prop="id" >
        <Input v-model="form.id" disabled style="width: 60%" placeholder="配置ID"></Input>
      </FormItem>
      <FormItem label="配置类型" prop="type">
        <Select v-model="form.type" clearable style="width:200px" placeholder="请选择配置类型">
          <Option value="text">文本</Option>
          <Option value="json">JSON</Option>
        </Select>
      </FormItem>
      <FormItem label="名称" prop="name">
        <Input v-model="form.name" style="width: 60%" placeholder="名称"></Input>
      </FormItem>
      <FormItem label="标识" prop="code">
        <Input v-model="form.code" :disabled="form.id" style="width: 60%" placeholder="标识"></Input>
      </FormItem>
      <FormItem v-if="form.type!=='json'" label="值" prop="val">
        <Input type="textarea"  v-model="form.val" :autosize="{minRows: 8,maxRows: 15}" placeholder="文本值"></Input>
      </FormItem>
      <FormItem v-if="form.type=='json'" label="值" prop="json_val">
        <Input v-model="form.json_val" type="textarea" :autosize="{minRows: 8,maxRows: 15}"  placeholder="JSON"></Input>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input  v-model="form.remark" style="width: 60%" placeholder="remark"></Input>
      </FormItem>
      <FormItem v-show="showFooter">
        <Button type="primary" @click="handleCancel('form')">取消</Button>
        <Button @click="handleSubmit('form')" style="margin-left: 8px">确定</Button>
      </FormItem>
    </Form>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'SysConfigEdit',
  components: {},
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
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue'])
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
      sysConfiges: [],
      form: {},
      rules: {
        // type: [{ type: 'number', required: true, message: '请选择配置类型', trigger: 'change' }],
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
              res = await this.$api.addSysConfig(this.form)
            } else {
              res = await this.$api.updateSysConfig(this.form)
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
