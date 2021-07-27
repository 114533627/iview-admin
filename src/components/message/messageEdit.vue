<template>
  <div>
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="导航ID" prop="id" >
        <Input v-model="form.id" disabled style="width: 60%" placeholder="导航ID"></Input>
      </FormItem>
      <FormItem label="导航类型" prop="type">
        <Select v-model="form.type" clearable style="width:200px" placeholder="请选择导航类型">
          <Option v-for="item in navigationTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="语言版本" prop="lang">
        <Select v-model="form.lang" clearable style="width:200px" placeholder="请选择语言版本">
          <Option v-for="item in langTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="父级ID" prop="parent_id">
        <Select v-model="form.parent_id" clearable style="width:200px" placeholder="父级ID">
          <Option v-for="item in navigationes" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="名称" prop="name">
        <Input v-model="form.name" style="width: 60%" placeholder="名称"></Input>
      </FormItem>
      <FormItem label="url" prop="url">
        <Input v-model="form.url" style="width: 60%" placeholder="url"></Input>
      </FormItem>
      <FormItem label="级别" prop="level">
        <Input v-model="form.level" style="width: 60%" placeholder="级别 填1 或 2"></Input>
      </FormItem>
      <FormItem label="打开方式" prop="is_blank_target">
        <Select v-model="form.is_blank_target" clearable style="width:200px" placeholder="请选择打开方式">
          <Option :value="0">当前窗口</Option>
          <Option :value="1">新窗口</Option>
        </Select>
      </FormItem>
      <FormItem label="排序" prop="sort">
        <Input v-model="form.sort" style="width: 60%" placeholder="排序"></Input>
      </FormItem>
      <FormItem label="是否隐藏" prop="hidden">
        <Select v-model="form.hidden" clearable style="width:200px" placeholder="请选择请求方法">
          <Option :value="0">否</Option>
          <Option :value="1">是</Option>
        </Select>
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
  name: 'NavigationEdit',
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
      this.getNavigations()
    }
  },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    navigationTypeEnums () {
      return this.getEnumsByName('NavigationType')
    },
    langTypeEnums () {
      return this.getEnumsByName('LangType')
    }
  },
  async created () {
    this.form = { ...this.item }
    this.getNavigations()
  },
  mounted () {
  },
  beforeDestroy () {
  },
  data () {
    return {
      datatimeRange: [],
      navigationes: [],
      form: {},
      rules: {
        // type: [{ type: 'number', required: true, message: '请选择导航类型', trigger: 'change' }],
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
    async getNavigations () {
      try {
        let param = { page: 1, limit: 1000, lang: this.form.lang, type: this.form.type }
        let res = await this.$api.getNavigationList(param)
        if (res.code === 200) {
          const list = res.data.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
          this.navigationes = list
        } else {
          this.navigationes = []
        }
      } catch (err) {
        this.$Message.error(err && err.desc ? err.desc : err)
        this.navigationes = []
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
              res = await this.$api.addNavigation(this.form)
            } else {
              res = await this.$api.updateNavigation(this.form)
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
