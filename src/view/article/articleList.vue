<template>
  <Card>
    <div slot="title">
      <Form ref="form" :model="searchParams" inline>
        <FormItem prop="kwd">
          <Input v-model="searchParams.kwd" clearable placeholder="搜索关键词"></Input>
        </FormItem>
        <FormItem prop="lang">
          <Select v-model="searchParams.lang" clearable style="width:200px" placeholder="请选择语言">
            <Option v-for="item in langTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="type">
          <Select v-model="searchParams.type" clearable style="width:200px" placeholder="请选择类型">
            <Option v-for="item in articleTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getDataList()">查询</Button>
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
    <Modal
      ref="editModal"
      v-model="boxShow"
      width="1000"
      :title="boxTitle"
      @on-ok="okHandle"
      @on-cancel="cancelHandle">
      <article-edit ref="edit" :item="item" :operate="operate" @editOk="editOkHandle"></article-edit>
    </Modal>
    <Modal
      v-model="boxShow2"
      width="800"
      title="SEO设置"
      @on-ok="okHandle2"
      @on-cancel="cancelHandle2">
      <seo-edit ref="seo" table-name="article" :article-type="articleType" :target-id="targetId" @seoOk="seoOkHandle"></seo-edit>
    </Modal>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import Operate from '../../components/common/Operate'
import ArticleEdit from '../../components/article/articleEdit'
import SeoEdit from '../../components/common/SeoEdit'

export default {
  name: 'articleList',
  components: { Operate, ArticleEdit, SeoEdit },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    langTypeEnums () {
      return this.getEnumsByName('LangType')
    },
    articleTypeEnums () {
      return this.getEnumsByName('ArticleType')
    }
  },
  data () {
    return {
      orgs: [],
      articleType: '',
      targetId: 0,
      boxShow2: false,
      operate: 'add',
      boxShow: false,
      boxTitle: '添加内容信息',
      loading: false,
      dataList: [],
      searchParams: {
        kwd: ''
      },
      page_info: {
        page: 1,
        limit: 10,
        total: 0,
        orderBy: 'article.modified_time'
      },
      item: {},
      columns: [
        {
          title: 'ID',
          width: 60,
          key: 'id'
        },
        {
          title: '标题',
          width: 120,
          key: 'name'
        },
        {
          title: '类型',
          width: 80,
          key: 'type',
          render: (h, { row, column, index }) => {
            return h('span', {
              domProps: {
                innerHTML: this.getEnumLabelByValue('ArticleType', row.type)
              }
            })
          }
        },
        {
          title: '语言',
          width: 80,
          key: 'lang',
          render: (h, { row, column, index }) => {
            return h('span', {
              domProps: {
                innerHTML: this.getEnumLabelByValue('LangType', row.lang)
              }
            })
          }
        },
        {
          title: '所属机构',
          width: 80,
          key: 'org_id',
          render: (h, { row, column, index }) => {
            return h('span', {
              domProps: {
                innerHTML: this.getOrgNameById(row.org_id)
              }
            })
          }
        },
        {
          title: '关联类型',
          width: 80,
          key: 'org_arti_type',
          render: (h, { row, column, index }) => {
            return h('span', {
              domProps: {
                innerHTML: this.getEnumLabelByValue('OrgArtiType', row.org_arti_type)
              },
              'class': 'list-img'
            })
          }
        },
        {
          title: '图片',
          width: 80,
          align: 'center',
          key: 'img_url',
          render: (h, { row, column, index }) => {
            return h('img', {
              attrs: {
                src: row.img_url
              },
              'class': 'list-img'
            })
          }
        },
        {
          title: 'introduction',
          width: 80,
          align: 'center',
          key: 'img_url',
          render: (h, { row, column, index }) => {
            return h('div', {
              domProps: {
                innerHTML: row.introduction && row.introduction.length > 20 ? row.introduction.substring(0, 17) + '...' : row.introduction
              }
            })
          }
        },
        {
          title: '发布时间',
          width: 80,
          key: 'deploy_time'
        },
        {
          title: '开始时间',
          width: 80,
          key: 'start_time'
        },
        {
          title: '结束时间',
          width: 80,
          key: 'end_time'
        },
        {
          title: '中英对应版ID',
          width: 100,
          align: 'center',
          key: 'to_id'
        },
        {
          title: '更新时间',
          width: 80,
          key: 'modified_time'
        },
        {
          title: '操作',
          width: 150,
          render: (h, { row, column, index }) => {
            return h(Operate, {
              props: {
                need: { detail: false, edit: true, del: true, seo: true },
                rowData: row
              },
              on: {
                edit: this.editHandle,
                del: this.delHandle,
                seo: this.seoHandle
              }
            })
          }
        }
      ]
    }
  },
  async created () {
    await this.getOrgs()
    this.getDataList()
  },
  mounted () {
    this.$refs.editModal.ok = () => {
      this.$refs.edit.handleSubmit()
    }
  },
  methods: {
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
      this.$api.getArticleList(params).then(res => {
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
    async getOrgs () {
      try {
        let param = { page: 1, limit: 1000 }
        console.log(param)
        let res = await this.$api.getOrganizationList(param)
        if (res.code === 200) {
          const list = res.data.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
          this.orgs = list
        } else {
          this.orgs = []
        }
      } catch (err) {
        this.$Message.error(err && err.desc ? err.desc : err)
        this.orgs = []
      }
    },
    getOrgNameById (id) {
      for (let orgsKey in this.orgs) {
        if (this.orgs[orgsKey].value === id) return this.orgs[orgsKey].label
      }
      return id
    },
    addHandle () {
      this.item = {}
      this.edit('添加内容信息', 'add')
    },
    edit (title, operate) {
      this.boxShow = true
      this.boxTitle = title
      this.operate = operate
    },
    editHandle (row) {
      this.item = { ...row }
      this.edit('编辑内容信息', 'update')
    },
    delHandle (row) {
      this.$api.delArticle(row).then(res => {
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
      if (row.type === 'img') this.$Message.warning('图片类型的内容，无需维护seo')
      else {
        console.log(row.id)
        this.targetId = row.id
        this.articleType = row.type
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
    }
  }
}
</script>

<style scoped>

</style>
