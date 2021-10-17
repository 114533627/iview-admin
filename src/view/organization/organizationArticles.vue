<template>
  <Card>
    <div slot="title">
      <Tabs v-model="tab">
        <TabPane label="自主创建" name="self"></TabPane>
        <TabPane label="推荐关联" name="recommend" v-if="orgArtiType!=='ljgd'"></TabPane>
      </Tabs>
      <Form inline>
        <!--        <FormItem>-->
        <!--          {{title}}-->
        <!--        </FormItem>-->

        <FormItem v-if="!(orgArtiType==='ljgd' && dataList.length>=1) && tab==='self'">
          <Button type="primary" @click="addHandle">添加</Button>
        </FormItem>
        <FormItem v-if="orgArtiType!=='ljgd'">
          <Button type="primary" @click="addRecommendHandle">添加推荐</Button>
        </FormItem>
        <FormItem v-if="tab==='recommend' && orgArtiType!=='ljgd' ">
          <Button type="primary" @click="delRecommendHandle">移除推荐</Button>
        </FormItem>
        <FormItem >
          <a href="/doc/wicco专题大事件素材需求.docx" download="wicco专题大事件素材需求.docx">添加专题大事件帮助文档</a>
        </FormItem>
      </Form>
    </div>
    <div class="content">
      <Table border :loading="loading" ref="selection" :columns="columns" :data="dataList"
             @on-selection-change="selectionChangeHandle"
      ></Table>
    </div>
    <Modal
      ref="editModal"
      v-model="boxShow"
      width="1000"
      :title="boxTitle"
      @on-ok="okHandle"
      @on-cancel="cancelHandle">
      <article-edit ref="edit" :item="item" :operate="operate" :org-arti-type="orgArtiType"
                    @editOk="editOkHandle"></article-edit>
    </Modal>
    <Modal
      v-model="boxShow2"
      width="800"
      title="SEO设置"
      @on-ok="okHandle2"
      @on-cancel="cancelHandle2">
      <seo-edit ref="seo" table-name="article" :article-type="articleType" :target-id="targetId"
                @seoOk="seoOkHandle"></seo-edit>
    </Modal>
    <!--推荐关联-->
    <Modal
      ref="relationModal"
      v-model="boxShow3"
      width="800"
      title="推荐关联"
      @on-ok="okHandle3"
      @on-cancel="cancelHandle3">
      <article-show-relation-list ref="relation" :item="item" @editOk="editOkHandle"></article-show-relation-list>
    </Modal>
  </Card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Operate from '../../components/common/Operate'
import ArticleEdit from '../../components/article/articleEdit'
import ArticleShowRelationList from '../../components/article/articleShowRelationList'
import SeoEdit from '../../components/common/SeoEdit'

export default {
  name: 'organizationArticles',
  components: { Operate, ArticleEdit, SeoEdit, ArticleShowRelationList },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    langTypeEnums () {
      return this.getEnumsByName('LangType')
    },
    articleTypeEnums () {
      return this.getEnumsByName('ArticleType')
    },
    orgArtiTypeEnums () {
      return this.getEnumsByName('OrgArtiType')
    },
    title () {
      let { name, org_arti_type } = this.$route.query
      return '机构：' + name + ' > ' + this.getEnumLabelByValue('OrgArtiType', org_arti_type)
    },
    orgArtiType () {
      let { org_arti_type } = this.$route.query
      if (this.getEnumLabelByValue('OrgArtiType', org_arti_type)) {
        return org_arti_type
      }
      return 'jujiao'
    },
    orgId () {
      let { org_id } = this.$route.query
      return org_id
    }
  },
  watch: {
    tab () {
      this.getDataList()
    }
  },
  data () {
    return {
      tab: 'self',
      show: false,
      item: {},
      selectedRows: [],
      articleType: '',
      targetId: 0,
      boxShow2: false,
      boxShow3: false,
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
        total: 0
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
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
          key: 'org_id'
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
  created () {
    this.getDataList()
  },
  mounted () {
    if (!this.orgId || !typeof (this.orgId) === 'number') {
      this.$Modal.confirm({
        content: 'orgId 不能为空，请检查',
        onCancel: () => this.closeTag(this.$route),
        onOk: () => this.closeTag(this.$route)
      })
    }
    this.$refs.editModal.ok = () => {
      this.$refs.edit.handleSubmit()
    }
    this.$refs.relationModal.ok = () => {
      this.$refs.relation.handleSubmit()
    }
  },
  methods: {
    ...mapMutations(['closeTag']),
    getDataList () {
      let { org_id, org_arti_type } = this.$route.query
      this.loading = true
      let params = { orgId: org_id, orgArtiType: org_arti_type, page: 1, limit: 1000, tab: this.tab }
      this.$api.getArticleList(params).then(res => {
        this.loading = false
        if (res.code === 200) {
          if (res.data.length) {
            res.data.forEach(item => {
              if (this.tab === 'self' && item.is_recommend) item._disabled = true
            })
          }
          this.dataList = res.data
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error(err && err.desc ? err.desc : err)
      })
    },
    addHandle () {
      this.item = { org_arti_type: this.orgArtiType, org_id: this.orgId }
      this.edit('添加内容信息', 'add')
    },
    addRecommendHandle () {
      if (this.tab === 'self') {
        if (this.selectedRows.length === 0) {
          this.$Message.info('请先选择要添加推荐的行')
          return
        }
        let text = '添加推荐'
        this.$Modal.confirm({
          title: '确认',
          content: `<p>确认${text}吗？</p>`,
          onOk: () => {
            if (this.selectedRows.length) {
              Promise.all(this.selectedRows.map(item => {
                let params = { org_id: this.orgId, type: this.orgArtiType, object_id: item.id }
                return this.$api.addOrgRecommendArticle(params)
              })).then(res => {
                this.$Message.success(`${text}成功`)
                this.getDataList()
              }).catch(err => {
                this.$Message.error(err && err.desc ? err.desc : err)
              })
            }
          },
          onCancel: () => {
          }
        })
      } else {
        this.item = { org_arti_type: this.orgArtiType, org_id: this.orgId }
        this.boxShow3 = true
      }
    },
    delRecommendHandle () {
      let text = '移除推荐'
      this.$Modal.confirm({
        title: '确认',
        content: `<p>确认${text}吗？</p>`,
        onOk: () => {
          if (this.selectedRows.length) {
            Promise.all(this.selectedRows.map(item => {
              let params = { org_id: this.orgId, type: this.orgArtiType, object_id: item.id }
              return this.$api.delOrgRecommendArticle(params)
            })).then(res => {
              this.getDataList()
              this.$Message.success(`${text}成功`)
            }).catch(err => {
              this.$Message.error(err && err.desc ? err.desc : err)
            })
          }
        },
        onCancel: () => {
        }
      })
    },
    edit (title, operate) {
      this.boxShow = true
      this.boxTitle = title
      this.operate = operate
    },
    editHandle (row) {
      this.item = row
      this.edit('编辑内容信息', 'update')
    },
    delHandle (row) {
      this.$api.delArticle(row).then(res => {
        if (res.code === 1) {
          this.$Message.success('删除成功')
        } else {
          this.$Message.success(res.desc)
        }
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
      this.boxShow3 = false
      this.boxShow = false
      this.getDataList()
    },
    seoHandle (row) {
      if (row.type === 'img') {
        this.$Message.warning('图片类型的内容，无需维护seo')
      } else {
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
    },
    okHandle3 () {

    },
    cancelHandle3 () {

    },
    selectionChangeHandle (rows) {
      this.selectedRows = rows
    }
  }
}
</script>

<style scoped>

</style>
