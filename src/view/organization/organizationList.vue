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
        <FormItem>
          <Button type="primary" @click="getDataList()">查询</Button>
        </FormItem>
<!--        <FormItem>-->
<!--          <Button type="primary" @click="addHandle">添加</Button>-->
<!--        </FormItem>-->
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
      <organization-edit ref="edit" :item="item" :operate="operate" @editOk="editOkHandle"></organization-edit>
    </Modal>
    <Modal
      v-model="boxShow2"
      width="800"
      title="SEO设置"
      @on-ok="okHandle2"
      @on-cancel="cancelHandle2">
      <seo-edit ref="seo" table-name="organization" :target-id="targetId" article-type="org" @seoOk="seoOkHandle"></seo-edit>
    </Modal>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import Operate from '../../components/common/Operate'
import OrganizationEdit from '../../components/organization/organizationEdit'
import SeoEdit from '../../components/common/SeoEdit'

export default {
  name: 'OrganizationList',
  components: { Operate, OrganizationEdit, SeoEdit },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    orgTypeEnums () {
      return this.getEnumsByName('OrgType')
    },
    langTypeEnums () {
      return this.getEnumsByName('LangType')
    }
  },
  data () {
    return {
      loadingModal: true,
      users: [],
      targetId: 0,
      boxShow2: false,
      operate: 'add',
      boxShow: false,
      boxTitle: '添加机构信息',
      loading: false,
      dataList: [],
      searchParams: {
        kwd: ''
      },
      page_info: {
        page: 1,
        limit: 20,
        total: 10
      },
      item: {},
      columns: [
        {
          title: 'ID',
          width: 60,
          key: 'id'
        },
        {
          title: '所属用户',
          width: 60,
          key: 'username'
        },
        {
          title: '名称',
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
                innerHTML: this.getEnumLabelByValue('OrgType', row.type)
              }
            })
          }
        },
        {
          title: '状态',
          width: 80,
          key: 'status',
          render: (h, { row, column, index }) => {
            return h('span', {
              domProps: {
                innerHTML: row.status ? '资料上传中' : '正常'
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
          title: '代号',
          width: 80,
          key: 'code'
        },
        {
          title: 'logo',
          width: 80,
          align: 'center',
          key: 'logo',
          render: (h, { row, column, index }) => {
            return h('img', {
              attrs: {
                src: row.logo
              },
              'class': 'list-img'
            })
          }
        },
        {
          title: '中英对应版ID',
          width: 100,
          align: 'center',
          key: 'to_id'
        },
        {
          title: '标签',
          width: 80,
          key: 'org_tag'
        },
        {
          title: '操作',
          width: 330,
          render: (h, { row, column, index }) => {
            return h(Operate, {
              props: {
                need: { edit: true, seo: true, jujiao: true, ljgd: true, hdrl: true, csdsj: true },
                rowData: row
              },
              on: {
                edit: this.editHandle,
                del: this.delHandle,
                seo: this.seoHandle,
                jujiao: this.jujiaoHandle,
                ljgd: this.ljgdHandle,
                hdrl: this.hdrlHandle,
                csdsj: this.csdsjHandle
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
      this.$api.getOrganizationList(params).then(res => {
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
    addHandle () {
      this.item = {}
      this.edit('添加机构信息', 'add')
    },
    edit (title, operate) {
      this.boxShow = true
      this.boxTitle = title
      this.operate = operate
    },
    editHandle (row) {
      this.item = { ...row }
      this.edit('编辑机构信息', 'update')
    },
    delHandle (row) {
      this.$api.delOrganization(row).then(res => {
        if (res.code === 1) this.$Message.success('删除成功')
        else this.$Message.success(res.desc)
        this.getDataList()
      })
    },
    // 聚焦图集
    jujiaoHandle (row) {
      this.$router.push({
        name: 'organizationArticles',
        query: { org_id: row.id, org_arti_type: 'jujiao', name: row.name }
      })
    },
    // 了解更多
    ljgdHandle (row) {
      this.$router.push({
        name: 'organizationArticles',
        query: { org_id: row.id, org_arti_type: 'ljgd', name: row.name }
      })
    },
    // 活动日历管理
    hdrlHandle (row) {
      this.$router.push({
        name: 'organizationArticles',
        query: { org_id: row.id, org_arti_type: 'hdrl', name: row.name }
      })
    },
    // 城市大事件管理
    csdsjHandle (row) {
      this.$router.push({
        name: 'organizationArticles',
        query: { org_id: row.id, org_arti_type: 'csdsj', name: row.name }
      })
    },
    okHandle () {
      // modal 的 ok的逻辑在 mounted 重定义了
    },
    cancelHandle () {
      this.$refs.edit.handleCancel()
    },
    editOkHandle () {
      this.boxShow = false
      this.getDataList()
    },
    seoHandle (row) {
      console.log(row.id)
      this.targetId = row.id
      this.boxShow2 = true
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
