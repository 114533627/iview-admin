<template>
  <Card>
    <div slot="title">
      <Tabs v-model="tab">
        <TabPane label="自主创建" name="self"></TabPane>
        <TabPane label="推荐关联" name="recommend"></TabPane>
      </Tabs>
      <Form inline>
<!--        <FormItem>-->
<!--          {{title}}-->
<!--        </FormItem>-->
        <FormItem v-if="!(orgArtiType==='ljgd' && dataList.length>=1)">
          <Button type="primary" @click="addHandle">添加</Button>
        </FormItem>
      </Form>
    </div>
    <div class="content">
      <Table border :loading="loading" ref="selection" :columns="columns" :data="dataList"></Table>
    </div>
    <Modal
      ref="editModal"
      v-model="boxShow"
      width="1000"
      :title="boxTitle"
      @on-ok="okHandle"
      @on-cancel="cancelHandle">
      <article-edit ref="edit" :item="item" :operate="operate" :org-arti-type="orgArtiType" @editOk="editOkHandle"></article-edit>
    </Modal>
    <Modal
      v-model="boxShow2"
      width="800"
      title="SEO设置"
      @on-ok="okHandle2"
      @on-cancel="cancelHandle2">
      <seo-edit ref="seo" table-name="article" :article-type="articleType" :target-id="targetId" @seoOk="seoOkHandle"></seo-edit>
    </Modal>
    <!--推荐关联-->
    <Modal
      v-model="boxShow3"
      width="800"
      title="推荐关联"
      @on-ok="okHandle3"
      @on-cancel="cancelHandle3">
        <div>123</div>
    </Modal>
  </Card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Operate from '../../components/common/Operate'
import ArticleEdit from '../../components/article/articleEdit'
import SeoEdit from '../../components/common/SeoEdit'

export default {
  name: 'organizationArticles',
  components: { Operate, ArticleEdit, SeoEdit },
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
          this.dataList = res.data
        }
      }).catch(err => {
        this.loading = false
        this.$Message.error(err)
      })
    },
    addHandle () {
      this.item = { org_arti_type: this.orgArtiType, org_id: this.orgId }
      if (this.tab === 'self') {
        this.edit('添加内容信息', 'add')
      } else {
        this.boxShow3 = true
      }
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
    },
    okHandle3 () {
      // this.$refs.seo.handleSubmit()
    },
    cancelHandle3 () {
      // this.$refs.seo.handleCancel()
    }
  }
}
</script>

<style scoped>

</style>
