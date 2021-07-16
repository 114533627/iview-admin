<template>
    <div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="内容ID" prop="id" >
          <Input v-model="form.id" disabled style="width: 60%" placeholder="内容ID"></Input>
        </FormItem>
        <FormItem label="内容类型" prop="type">
          <Select v-model="form.type" clearable style="width:200px" placeholder="请选择内容类型">
            <Option v-for="item in articleTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="语言版本" prop="lang">
          <Select v-model="form.lang" clearable style="width:200px" placeholder="请选择语言">
            <Option v-for="item in langTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="所属机构" prop="org_id">
          <Select v-model="form.org_id" clearable style="width:300px" placeholder="选择内容所属机构" filterable>
            <Option v-for="item in orgs" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="机构内容类型" prop="org_arti_type">
          <Select v-model="form.org_arti_type" clearable style="width:200px" placeholder="机构内容关联类型">
            <Option v-for="item in orgArtiTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="起止时间" prop="time" v-if="form.type==='csdsj' || form.type==='hdrl'">
          <Row>
            <Col span="10">
              <DatePicker type="datetimerange" style="width: 320px" placeholder="起止时间" v-model="datatimeRange"></DatePicker>
            </Col>
            <Col span="4" style="text-align: center">发布时间</Col>
            <Col span="10">
              <DatePicker type="datetime" placeholder="发布时间" v-model="form.deploy_time"></DatePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="标题" prop="name">
          <Input v-model="form.name" style="width: 60%" placeholder="内容标题"></Input>
        </FormItem>
        <FormItem label="内容链接" prop="link_url" v-if="form.type!=='img'">
          <Input v-model="form.link_url" placeholder="内容页面链接。前台访问该内容的页面链接"></Input>
        </FormItem>
        <FormItem :label="`关联${form.lang=='zh' ? '英文' : '中文'}版本内容信息`" prop="to_id" v-if="form.type!=='img'">
          <Select v-model="form.to_id" clearable style="width:300px" :placeholder="`关联${form.lang=='zh' ? '英文' : '中文'}版本内容信息，输入一个空格试试`" filterable>
            <Option v-for="item in articles" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="图片" prop="img_url">
          <upload-media :max="1" :upload-param="{tableName: 'article',targetId: ''}" :default-list="form.img_url ? [{url: form.img_url}] : []" @uploadOver="(filelist) => uploadOverHandle(filelist,'img_url')"></upload-media>
        </FormItem>

        <FormItem label="简介" prop="introduction" v-if="form.type!=='img'">
          <Input v-model="form.introduction" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="简介" />
        </FormItem>
        <FormItem  label="内容" prop="content" v-if="form.type!=='img'">
          <editor ref="editor" :value="form.content" @on-change="changeEditorHandle" />
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
  name: 'ArticleEdit',
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
      if (this.form.type === 'csdsj' || this.form.type === 'hdrl') {
        this.datatimeRange = []
        if (this.form.start_time === 'Invalid Date') this.form.start_time = ''
        if (this.form.end_time === 'Invalid Date') this.form.end_time = ''
        if (this.form.start_time) this.datatimeRange.push(this.$dayjs(this.form.start_time, 'YYYY-MM-DD HH:mm:ss').toDate())
        if (this.form.end_time) this.datatimeRange.push(this.$dayjs(this.form.end_time, 'YYYY-MM-DD HH:mm:ss').toDate())
      }
    },
    'form.lang': function (value) {
      if (value) {
        this.getOrgs()
        this.getArticles()
      }
    },
    'form.org_id': function (value) {
      if (value) {
        this.getOrgs()
        this.getArticles()
      }
    }
  },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    articleTypeEnums () {
      return this.getEnumsByName('ArticleType')
    },
    langTypeEnums () {
      return this.getEnumsByName('LangType')
    },
    orgArtiTypeEnums () {
      return this.getEnumsByName('OrgArtiType')
    }
  },
  async created () {
    this.form = { ...this.item }
    if (this.form.lang || this.form.org_id) {
      await this.getOrgs()
      await this.getArticles()
    }
  },
  mounted () {
  },
  beforeDestroy () {
  },
  data () {
    return {
      datatimeRange: [],
      articles: [],
      orgs: [],
      form: {},
      rules: {
        type: [{ type: 'string', required: true, message: '请选择内容类型', trigger: 'change' }],
        lang: [{ type: 'string', required: true, message: '请选择语言版本', trigger: 'change' }],
        org_id: [{ type: 'number', required: true, message: '请选择所属机构', trigger: 'change' }],
        org_arti_type: [{ type: 'string', required: true, message: '请选择机构内容类型', trigger: 'change' }],
        img_url: [{ type: 'string', required: true, message: '请上传图片', trigger: 'blur' }],
        name: [{ required: true, message: '请输入标题', trigger: 'blur' }, { type: 'string', max: 50, message: '长度不超过50个字符', trigger: 'blur' }]
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
    async getOrgs () {
      try {
        let param = { page: 1, limit: 1000 }
        if (this.item.org_id) param.id = this.item.org_id
        else param.lang = this.form.lang === 'zh' ? 'zh' : 'en'
        console.log(param)
        let res = await this.$api.getOrganizationList(param)
        if (res.code === 200) {
          const list = res.data.map(item => {
            if (item.id === this.item.org_id) this.$set(this.form, 'lang', item.lang)
            return {
              value: item.id,
              label: item.name
            }
          })
          this.orgs = list
        } else {
          this.orgs = []
        }
      } catch (e) {
        this.$Message.error(e)
        this.orgs = []
      }
    },
    async getArticles () {
      let param = { page: 1, limit: 5000, lang: this.form.lang === 'zh' ? 'en' : 'zh' }
      try {
        let res = await this.$api.getArticleList(param)
        if (res.code === 200) {
          const list = res.data.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
          this.articles = list
        } else {
          this.articles = []
        }
      } catch (e) {
        this.$Message.error(e)
        this.articles = []
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
            let params = { ...this.form }
            if (this.form.deploy_time)params.deploy_time = this.$dayjs(this.form.deploy_time).format('YYYY-MM-DD HH:mm:ss')
            if (this.datatimeRange.length > 0 && (this.form.type === 'csdsj' || this.form.type === 'hdrl')) {
              params.start_time = this.$dayjs(this.datatimeRange[0]).format('YYYY-MM-DD HH:mm:ss')
              params.end_time = this.$dayjs(this.datatimeRange[1]).format('YYYY-MM-DD HH:mm:ss')
            }

            if (this.operate === 'add') {
              res = await this.$api.addArticle(params)
            } else {
              res = await this.$api.updateArticle(params)
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
