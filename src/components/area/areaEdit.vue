<template>
  <div>
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="区域ID" prop="id" >
        <Input v-model="form.id" disabled style="width: 60%" placeholder="区域ID"></Input>
      </FormItem>
      <FormItem label="区域类型" prop="type">
        <Select v-model="form.type" clearable style="width:200px" placeholder="请选择区域类型">
          <Option v-for="item in areaTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="父级区域" prop="parent_id">
        <Select v-model="form.parent_id" clearable style="width:200px" placeholder="请选择父级区域">
          <Option v-for="item in areas" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="中文名称" prop="name_zh">
        <Input v-model="form.name_zh" style="width: 60%" placeholder="中文名称"></Input>
      </FormItem>
      <FormItem label="英文名称" prop="name_en">
        <Input v-model="form.name_en" style="width: 60%" placeholder="英文名称"></Input>
      </FormItem>
      <FormItem label="地图是否显示" prop="show_status">
        <Select v-model="form.show_status" clearable style="width:200px" placeholder="请选择在地图是否显示">
          <Option v-for="item in showStatusTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="x坐标" prop="axis_x">
        <Input type="number" v-model="form.axis_x" style="width: 60%" placeholder="x坐标"></Input>
      </FormItem>
      <FormItem label="y坐标" prop="axis_y">
        <Input v-model="form.axis_y" style="width: 60%" placeholder="y坐标"></Input>
      </FormItem>
      <FormItem label="中文机构ID" prop="axis_y">
        <Input v-model="form.zh_org_id" disabled style="width: 60%" placeholder="中文机构ID"></Input>
      </FormItem>
      <FormItem label="英文机构ID" prop="axis_y">
        <Input v-model="form.en_org_id" disabled style="width: 60%" placeholder="英文机构ID"></Input>
      </FormItem>
      <FormItem label="图片" prop="img_url">
        <upload-media :max="1" :upload-param="{tableName: 'area',targetId: ''}" :default-list="form.img_url ? [{url: form.img_url}] : []" @uploadOver="(filelist) => uploadOverHandle(filelist,'img_url')"></upload-media>
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
  name: 'AreaEdit',
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
    areaTypeEnums () {
      return this.getEnumsByName('AreaType')
    },
    showStatusTypeEnums () {
      return this.getEnumsByName('ShowStatusType')
    }
  },
  async created () {
    this.form = { ...this.item }
    this.getAreas()
  },
  mounted () {
  },
  beforeDestroy () {
  },
  data () {
    return {
      datatimeRange: [],
      areas: [],
      form: {},
      rules: {
        type: [{ type: 'number', required: true, message: '请选择区域类型', trigger: 'change' }],
        // img_url: [{ type: 'string', required: true, message: '请上传图片', trigger: 'blur' }],
        name_zh: [{ required: true, message: '请输入标题', trigger: 'blur' }, { type: 'string', max: 50, message: '长度不超过50个字符', trigger: 'blur' }],
        name_en: [{ required: true, message: '请输入标题', trigger: 'blur' }, { type: 'string', max: 50, message: '长度不超过50个字符', trigger: 'blur' }]
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
    async getAreas () {
      try {
        let param = { page: 1, limit: 1000 }
        console.log(param)
        let res = await this.$api.getAreaList(param)
        if (res.code === 200) {
          const list = res.data.map(item => {
            return {
              value: item.id,
              label: item.name_zh
            }
          })
          this.areas = list
        } else {
          this.areas = []
        }
      } catch (e) {
        this.$Message.error(e)
        this.areas = []
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
              res = await this.$api.addArea(this.form)
            } else {
              res = await this.$api.updateArea(this.form)
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
