<template>
  <div>
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="SEOID" prop="id" >
        <Input v-model="form.id" disabled style="width: 60%" placeholder="SEOID"></Input>
      </FormItem>
      <FormItem label="类型" prop="type">
        <Select v-model="form.type" clearable style="width:200px" placeholder="请选择类型">
          <Option v-for="item in seoTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="模块名称" prop="table_name" >
        <Input v-model="form.table_name" disabled style="width: 60%" placeholder="模块名称"></Input>
      </FormItem>
      <FormItem label="目标ID" prop="target_id" >
        <Input v-model="form.target_id" disabled style="width: 60%" placeholder="目标ID"></Input>
      </FormItem>
      <FormItem label="页面标题" prop="title" >
        <Input v-model="form.title" type="textarea" :autosize="{minRows: 2,maxRows: 5}"  placeholder="页面标题"></Input>
      </FormItem>
      <FormItem label="页面关键词" prop="keywords" >
        <Input v-model="form.keywords" type="textarea" :autosize="{minRows: 2,maxRows: 5}"  placeholder="页面关键词"></Input>
      </FormItem>
      <FormItem label="页面描述" prop="description" >
        <Input v-model="form.description" type="textarea" :autosize="{minRows: 3,maxRows: 5}"  placeholder="页面描述"></Input>
      </FormItem>
      <FormItem label="页面名称" prop="page_name" >
        <Input v-model="form.page_name" type="text" placeholder="页面名称，非必填"></Input>
      </FormItem>
      <FormItem label="页面URL" prop="page_url" >
        <Input v-model="form.page_url" type="text" placeholder="页面URL，非必填"></Input>
      </FormItem>
      <FormItem v-show="false">
        <Button type="primary" @click="handleCancel('form')">取消</Button>
        <Button @click="handleSubmit('form')" style="margin-left: 8px">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SeoEdit',
  props: {
    tableName: {
      type: String,
      required: true
    },
    targetId: {
      type: Number,
      required: true
    },
    articleType: String
  },
  watch: {
    targetId (value) {
      this.form.target_id = value
      this.getSeo()
    },
    articleType (value) {
      this.form.type = value
    }
  },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    seoTypeEnums () {
      return this.getEnumsByName('SeoType')
    }
  },
  data () {
    return {
      form: {
        id: '',
        type: '',
        table_name: this.tableName,
        target_id: this.targetId,
        title: '',
        keywords: '',
        description: '',
        page_name: '',
        page_url: ''
      },
      rules: {

      }
    }
  },
  created () {
    if (this.targetId) this.getSeo()
    else {
      this.form = this.$options.data().form
      this.form.table_name = this.tableName
      this.form.target_id = this.targetId
    }
  },
  methods: {
    getSeo () {
      this.$api.getSeo({ tableName: this.tableName, targetId: this.targetId }).then(res => {
        if (res.code === 200) {
          if (res.data) this.form = res.data
          else {
            this.form = this.$options.data().form
            this.form.table_name = this.tableName
            this.form.target_id = this.targetId
            this.form.type = this.articleType
          }
        } else {
          this.$Message.error(res.desc)
        }
      }).catch(err => this.$Message.error(err))
    },
    handleCancel () {
      console.log('cancel edit')
    },
    handleSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = await this.$api.saveSeo(this.form)
          if (res != null && res.code === 200) {
            this.$Message.success('保存成功')
          } else {
            this.$Message.error(`保存失败 ${res.desc}`)
          }
          this.$emit('seoOk')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
