<template>
    <div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="机构ID" prop="id" >
          <Input v-model="form.id" disabled style="width: 60%" placeholder="机构ID"></Input>
        </FormItem>
        <FormItem label="机构名称" prop="name">
          <Input v-model="form.name" style="width: 60%" placeholder="机构名称"></Input>
        </FormItem>
        <FormItem label="代号" prop="code">
          <Input v-model="form.code" style="width: 60%" placeholder="代号"></Input>
        </FormItem>
        <FormItem label="了解更多" prop="link_url">
          <Input v-model="form.link_url"  style="width: 60%" placeholder="了解更多链接"></Input>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="form.remark" placeholder="备注"></Input>
        </FormItem>
        <FormItem label="语言版本" prop="lang">
          <Select v-model="form.lang" clearable style="width:200px" placeholder="请选择语言">
            <Option v-for="item in langTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="`关联${form.lang=='zh' ? '英文' : '中文'}版本机构信息`" prop="to_id">
          <Select v-model="form.to_id" clearable style="width:200px" :placeholder="`关联${form.lang=='zh' ? '英文' : '中文'}版本机构信息`"
                  filterable
                  :remote-method="remoteSearchHandle"
                  :loading="loading1">
            <Option v-for="item in options1" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="机构类型" prop="type">
          <Select v-model="form.type" clearable style="width:200px" placeholder="请选择机构类型">
            <Option v-for="item in orgTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="logo" prop="logo">
          <upload-media :max="1" :upload-param="{tableName: 'organization',targetId: ''}" :default-list="form.logo ? [{url: form.logo}] : []" @uploadOver="(filelist) => uploadOverHandle(filelist,'logo')"></upload-media>
        </FormItem>
        <FormItem label="背景" prop="bg_media_url">
          <upload-media :max="1" :upload-param="{tableName: 'organization',targetId: ''}" :default-list="form.bg_media_url ? [{url: form.bg_media_url}] : []" @uploadOver="(filelist) => uploadOverHandle(filelist,'bg_media_url')"></upload-media>
        </FormItem>
        <FormItem label="图片或视频1" prop="media_url1">
          <upload-media :max="1" :upload-param="{tableName: 'organization',targetId: ''}" :default-list="form.media_url1 ? [{url: form.media_url1}] : []" @uploadOver="(filelist) => uploadOverHandle(filelist,'media_url1')"></upload-media>
        </FormItem>
        <FormItem label="图片或视频2" prop="media_url2">
          <upload-media :max="1" :upload-param="{tableName: 'organization',targetId: ''}" :default-list="form.media_url2 ? [{url: form.media_url2}] : []" @uploadOver="(filelist) => uploadOverHandle(filelist,'media_url2')"></upload-media>
        </FormItem>

        <FormItem label="介绍" prop="introduction">
          <editor ref="editor" :value="form.introduction" @on-change="changeEditorHandle" />
        </FormItem>
        <FormItem v-show="false">
          <Button type="primary" @click="handleCancel('form')">取消</Button>
          <Button @click="handleSubmit('form')" style="margin-left: 8px">确定</Button>
        </FormItem>
      </Form>

    </div>
</template>

<script>
import UploadMedia from '../common/UploadMedia'
import { mapGetters } from 'vuex'
import Editor from '_c/editor'
export default {
  name: 'OrganizationEdit',
  components: { Editor, UploadMedia },
  props: {
    item: {
      type: Object
    },
    operate: String
  },
  watch: {
    item () {
      this.form = this.item
    }
  },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    orgTypeEnums () {
      return this.getEnumsByName('OrgType')
    },
    langTypeEnums () {
      return this.getEnumsByName('LangType')
    }
  },
  created () {
    this.form = this.item
  },
  mounted () {
  },
  beforeDestroy () {
    console.log('organizationEdit destroyed')
  },
  data () {
    return {
      loading1: false,
      options1: [],
      form: {},
      rules: {

      }
    }
  },
  methods: {
    uploadOverHandle (filelist, field) {
      if (filelist.length > 0) this.form[field] = filelist[0].url
      else this.form[field] = ''
    },
    changeEditorHandle (html) {
      this.form.introduction = html
    },
    async remoteSearchHandle (query) {
      if (query !== '') {
        this.loading1 = true
        let param = { page: 1, limit: 1000, kwd: query.trim() }
        try {
          let res = await this.$api.getOrganizationList(param)
          this.loading1 = false
          console.log(res)
          if (res.code === 200) {
            const list = res.data.map(item => {
              return {
                value: item.id,
                label: item.name
              }
            })
            console.log(list)
            this.options1 = list
          } else {
            this.options1 = []
          }
        } catch (e) {
          this.$Message.error(e)
          this.options1 = []
        }
      } else {
        this.options1 = []
      }
    },
    handleCancel () {
      console.log('cancel edit')
    },
    handleSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = null
          if (this.operate === 'add') {
            res = await this.$api.addOrganization(this.form)
          } else {
            res = await this.$api.addOrganization(this.form)
          }
          if (res != null && res.code === 200) {
            this.$Message.success(this.operate === 'add' ? '添加成功' : '保存成功')
          } else {
            this.$Message.error((this.operate === 'add' ? '添加' : '保存') + `失败 ${res.desc}`)
          }
          this.$emit('editOk')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
