<template>
  <div>
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="权限ID" prop="id" >
        <Input v-model="form.id" disabled style="width: 60%" placeholder="权限ID"></Input>
      </FormItem>
      <FormItem label="权限类型" prop="type">
        <Select v-model="form.type" clearable style="width:200px" placeholder="请选择权限类型">
          <Option v-for="item in privilegesTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="父级ID" prop="parent_id">
        <Select v-model="form.parent_id" clearable style="width:200px" placeholder="父级ID">
          <Option v-for="item in privilegeses" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="名称" prop="name">
        <Input v-model="form.name" style="width: 60%" placeholder="名称"></Input>
      </FormItem>
      <FormItem label="标识" prop="code">
        <Input v-model="form.code" style="width: 60%" placeholder="标识"></Input>
      </FormItem>
      <FormItem label="uri" prop="uri">
        <Input v-model="form.uri" style="width: 60%" placeholder="uri"></Input>
      </FormItem>
      <FormItem label="请求方法" prop="method">
        <Select v-model="form.method" clearable style="width:200px" placeholder="请选择请求方法">
          <Option v-for="item in methodTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="图标" prop="icon">
        <Input v-model="form.icon" style="width: 60%" placeholder="icon 图标"></Input>
      </FormItem>
      <FormItem label="排序" prop="sort">
        <Input v-model="form.sort" style="width: 60%" placeholder="排序"></Input>
      </FormItem>
      <FormItem label="前端组件" prop="component">
        <Input v-model="form.component" style="width: 60%" placeholder="前端组件"></Input>
      </FormItem>
      <FormItem label="前端路径" prop="path">
        <Input v-model="form.path" style="width: 60%" placeholder="前端路径"></Input>
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
import UploadMedia from '../common/UploadMedia'
import { mapGetters, mapMutations } from 'vuex'
import Editor from '_c/editor'
export default {
  name: 'PrivilegesEdit',
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
      this.getPrivilegess()
    }
  },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    privilegesTypeEnums () {
      return this.getEnumsByName('PrivilegesType')
    },
    methodTypeEnums () {
      return this.getEnumsByName('MethodType')
    }
  },
  async created () {
    this.form = { ...this.item }
    this.getPrivilegess()
  },
  mounted () {
  },
  beforeDestroy () {
  },
  data () {
    return {
      datatimeRange: [],
      privilegeses: [],
      form: {},
      rules: {
        // type: [{ type: 'number', required: true, message: '请选择权限类型', trigger: 'change' }],
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
    async getPrivilegess () {
      try {
        let param = { page: 1, limit: 1000 }
        console.log(param)
        let res = await this.$api.getPrivilegesList(param)
        if (res.code === 200) {
          const list = res.data.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
          this.privilegeses = list
        } else {
          this.privilegeses = []
        }
      } catch (err) {
        this.$Message.error(err && err.desc ? err.desc : err)
        this.privilegeses = []
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
              res = await this.$api.addPrivileges(this.form)
            } else {
              res = await this.$api.updatePrivileges(this.form)
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
