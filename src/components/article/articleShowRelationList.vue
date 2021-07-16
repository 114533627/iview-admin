<template>
  <Card>
    <div slot="title">
      <Form ref="form" :model="searchParams" inline>
        <FormItem prop="kwd">
          <Input v-model="searchParams.kwd" clearable placeholder="搜索关键词"></Input>
        </FormItem>
        <FormItem prop="type">
          <Select v-model="searchParams.type" clearable style="width:200px" placeholder="请选择类型">
            <Option v-for="item in areaTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getDataList()">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="content">
      <Table border :loading="loading" ref="selection" :columns="columns" :data="dataList"
             @on-selection-change="selectionChangeHandle"
      ></Table>
      <Page style="margin: 0 auto; width: 50%;"
            :current="page_info.page" :total="page_info.total" :page-size="page_info.limit" show-elevator show-sizer
            @on-change="pageChangeHandle"
            @on-page-size-change="limitChangeHandle"
      />
    </div>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import Operate from '../../components/common/Operate'
import AreaEdit from '../../components/area/areaEdit'
import AreaAreas from '../../components/area/areaAreas'

export default {
  name: 'articleShowRelationList',
  components: { Operate, AreaEdit, AreaAreas },
  props: { item: Object },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    langTypeEnums () {
      return this.getEnumsByName('LangType')
    },
    areaTypeEnums () {
      return this.getEnumsByName('AreaType')
    }
  },
  watch: {
    item () {
      this.getDataList()
    }
  },
  data () {
    return {
      articleType: '',
      selectedRows: [],
      orgs: [],
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
        }
      ]
    }
  },
  async created () {
    await this.getOrgs()
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
      let params = { orgId: this.item.org_id, type: this.item.org_arti_type, ...this.page_info }
      this.$api.getOrgCanRecommendArticles(params).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.dataList = res.data
          this.page_info = res.page_info
        } else {
          this.dataList = []
        }
      }).catch(err => {
        this.dataList = []
        this.loading = false
        this.$Message.error(err)
      })
    },
    getOrgNameById (id) {
      for (let orgsKey in this.orgs) {
        if (this.orgs[orgsKey].value === id) return this.orgs[orgsKey].label
      }
      return id
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
      } catch (e) {
        this.$Message.error(e)
        this.orgs = []
      }
    },
    addHandle () {
      this.item = {}
      this.edit('添加区域信息', 'add')
    },
    edit (title, operate) {
      this.boxShow = true
      this.boxTitle = title
      this.operate = operate
    },
    editHandle (row) {
      this.item = { ...row }
      this.edit('编辑区域信息', 'update')
    },
    delHandle (row) {
      this.$api.delArea(row).then(res => {
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
    selectionChangeHandle (rows) {
      this.selectedRows = rows
    },
    handleSubmit () {
      Promise.all(this.selectedRows.map(item => {
        let params = { org_id: this.item.org_id, type: this.item.org_arti_type, object_id: item.id }
        return this.$api.addOrgRecommendArticle(params)
      })).then(res => {
        this.$Message.success('添加成功')
        this.$emit('editOk')
      }).catch(err => {
        this.$emit('editOk')
        this.$Message.error(err && err.desc ? err.desc : err)
      })
    }
  }
}
</script>

<style scoped>

</style>
