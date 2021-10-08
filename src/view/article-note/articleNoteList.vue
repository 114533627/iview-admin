<template>
  <Card>
    <div slot="title">
      <Form ref="form" :model="searchParams" inline>
        <FormItem prop="article_id">
          <Input v-model="searchParams.articleId" clearable placeholder="活动或大事件ID"></Input>
        </FormItem>
        <FormItem prop="kwd">
          <Input v-model="searchParams.kwd" clearable placeholder="搜索关键词"></Input>
        </FormItem>
        <FormItem prop="lang">
          <Input v-model="searchParams.phone" clearable placeholder="电话"></Input>
        </FormItem>
        <FormItem prop="lang">
          <Input v-model="searchParams.email" clearable placeholder="email"></Input>
        </FormItem>
        <FormItem prop="type">
          <Select v-model="searchParams.status" clearable style="width:200px" placeholder="请选择状态">
            <Option v-for="item in articleStatusTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getDataList()">查询</Button>
          <Button style="margin-left: 20px" type="primary" @click="exportList">导出列表</Button>
        </FormItem>
<!--        <FormItem>
          <Button type="primary" @click="addHandle">添加</Button>
        </FormItem>-->
      </Form>
    </div>
    <div class="content">
      <Table border :loading="loading" ref="selection" :columns="columns" :data="dataList"></Table>
      <Page style="margin: 0 auto; width: 50%;"
            :current="page_info.page" :total="page_info.total" :page-size="page_info.limit" show-elevator show-sizer
            @on-change="pageChangeHandle"
            @on-page-size-change="limitChangeHandle"
      />
    </div>
<!--    <Modal-->
<!--      ref="editModal"-->
<!--      v-model="boxShow"-->
<!--      width="1000"-->
<!--      :title="boxTitle"-->
<!--      @on-ok="okHandle"-->
<!--      @on-cancel="cancelHandle">-->
<!--      <articleNote-edit ref="edit" :item="item" :operate="operate" @editOk="editOkHandle"></articleNote-edit>-->
<!--    </Modal>-->
<!--    <Modal-->
<!--      v-model="boxShow2"-->
<!--      width="800"-->
<!--      title="SEO设置"-->
<!--      @on-ok="okHandle2"-->
<!--      @on-cancel="cancelHandle2">-->
<!--      <seo-edit ref="seo" table-name="articleNote" :articleNote-type="articleNoteType" :target-id="targetId" @seoOk="seoOkHandle"></seo-edit>-->
<!--    </Modal>-->
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import Operate from '../../components/common/Operate'
// import ArticleEdit from '../../components/articleNote/articleNoteEdit'
// import SeoEdit from '../../components/common/SeoEdit'

export default {
  name: 'articleNoteList',
  components: { Operate },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    langTypeEnums () {
      return this.getEnumsByName('LangType')
    },
    articleStatusTypeEnums () {
      return this.getEnumsByName('ArticleStatusType')
    }
  },
  data () {
    return {
      orgs: [],
      articleNoteType: '',
      targetId: 0,
      boxShow2: false,
      operate: 'add',
      boxShow: false,
      boxTitle: '添加留资信息',
      loading: false,
      dataList: [],
      searchParams: {
        kwd: '',
        phone: '',
        email: '',
        status: '',
        articleId: ''
      },
      page_info: {
        page: 1,
        limit: 10,
        total: 0,
        orderBy: 'article_note.modified_time'
      },
      item: {},
      columns: [
        {
          title: 'ID',
          width: 60,
          key: 'id'
        },
        {
          title: '姓名',
          width: 80,
          key: 'name'
        },
        {
          title: '电话',
          width: 120,
          key: 'phone'
        },
        {
          title: 'Email',
          width: 160,
          key: 'email'
        },
        {
          title: '留言',
          width: 280,
          key: 'remark'
        },
        {
          title: '状态',
          width: 80,
          key: 'status',
          render: (h, { row, column, index }) => {
            return h('span', {
              domProps: {
                innerHTML: this.getEnumLabelByValue('ArticleStatusType', row.status)
              }
            })
          }
        },
        {
          title: '所属内容',
          width: 80,
          key: 'article_id',
          render: (h, { row, column, index }) => {
            return h('div', {
              domProps: {
                style: 'text-align: center;',
                innerHTML: '<a href="javascript:void(0)">' + row.article_id + '</a>'
              },
              on: {
                click: () => this.clickHandler(row.article_id)
              }
            })
          }
        },
        {
          title: '更新时间',
          width: 80,
          key: 'modified_time'
        },
        {
          title: '操作',
          width: 250,
          render: (h, { row, column, index }) => {
            return h(Operate, {
              props: {
                need: { del: true, articleStatusPass: row.status !== 1, articleStatusNoPass: row.status !== 2 },
                rowData: row,
                privCodes: { del: 'article_note_del', articleStatusPass: 'article_note_pass', articleStatusPass: 'article_note_no_pass' }
              },
              on: {
                del: this.delHandle,
                articleStatusPass: this.articleNoteStatusPassHandle,
                articleStatusNoPass: this.articleNoteStatusNoPassHandle
              }
            })
          }
        }
      ]
    }
  },
  async created () {
    this.getDataList()
  },
  mounted () {
    // this.$refs.editModal.ok = () => {
    //   this.$refs.edit.handleSubmit()
    // }
  },
  methods: {
    clickHandler (artiId) {
      console.log(artiId)
      this.$router.push({
        name: 'articleList',
        params: { id: artiId }
      })
    },
    pageChangeHandle (page) {
      this.page_info.page = page
      this.getDataList()
    },
    limitChangeHandle (limit) {
      this.page_info.limit = limit
      this.page_info.page = 1
      this.getDataList()
    },
    getDataList () {
      this.loading = true
      let params = { ...this.searchParams, ...this.page_info }
      this.$api.getArticleNoteList(params).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.dataList = res.data
          this.page_info.total = res.page_info.total
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error(err && err.desc ? err.desc : err)
      })
    },
    exportList () {
      this.loading = true
      let params = { ...this.searchParams, ...this.page_info }
      this.$api.exportArticleNoteList(params).then(res => {
        this.loading = false
        // console.log(res)
        const blob = new Blob([res.data], {
          type: 'application/vnd.ms-excel;charset=utf-8'
        })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        // 获取文件名
        const disposition = res.headers['content-disposition']
        if (disposition !== undefined) {
          let dispositions = disposition.substring(disposition.indexOf('=') + 1)
          // dispositions = dispositions.replace(/%/g,"%25");
          link.download = decodeURI(dispositions)
          link.click()
        }
      })
    },
    addHandle () {
      this.item = {}
      this.edit('添加留资信息', 'add')
    },
    edit (title, operate) {
      this.boxShow = true
      this.boxTitle = title
      this.operate = operate
    },
    editHandle (row) {
      this.item = { ...row }
      this.edit('编辑留资信息', 'update')
    },
    delHandle (row) {
      this.$api.delArticleNote(row).then(res => {
        if (res.code === 1) this.$Message.success('删除成功')
        else this.$Message.success(res.desc)
        this.getDataList()
      })
    },
    okHandle () {
      this.$refs.edit.handleSubmit()
    },
    cancelHandle () {
      this.$refs.edit.handleCancel()
    },
    editOkHandle () {
      this.boxShow = false
      this.getDataList()
    },
    seoHandle (row) {
      if (row.type === 'img') this.$Message.warning('图片类型的留资，无需维护seo')
      else {
        console.log(row.id)
        this.targetId = row.id
        this.articleNoteType = row.type
        this.boxShow2 = true
      }
    },
    okHandle2 () {
      this.$refs.seo.handleSubmit()
    },
    cancelHandle2 () {
      this.$refs.seo.handleCancel()
    },
    seoOkHandle () {
      // do nothing
    },
    articleNoteStatusPassHandle (row) {
      let params = { id: row.id, status: 1 }
      this.$api.updateArticleNoteStatus(params).then(res => {
        this.$Message.success('操作成功')
        this.getDataList()
      }).catch(err => this.$Message.error('操作失败'))
    },
    articleNoteStatusNoPassHandle (row) {
      let params = { id: row.id, status: 2 }
      this.$api.updateArticleNoteStatus(params).then(res => {
        this.$Message.success('操作成功')
        this.getDataList()
      }).catch(err => this.$Message.error('操作失败'))
    }
  }
}
</script>

<style scoped>

</style>
