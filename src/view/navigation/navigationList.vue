<template>
  <Card>
    <div slot="title">
      <Form ref="form" :model="searchParams" inline>
        <FormItem prop="kwd">
          <Input v-model="searchParams.kwd" clearable placeholder="搜索关键词"></Input>
        </FormItem>
        <FormItem prop="type">
          <Select v-model="searchParams.type" clearable style="width:200px" placeholder="请选择类型">
            <Option v-for="item in navigationTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="type">
          <Select v-model="searchParams.lang" clearable style="width:200px" placeholder="请选择类型">
            <Option v-for="item in langTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getDataList()">查询</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="addHandle">添加</Button>
        </FormItem>
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
      <navigation-edit ref="edit" :item="item" :operate="operate" @editOk="editOkHandle"></navigation-edit>
    </Modal>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import Operate from '../../components/common/Operate'
import NavigationEdit from '../../components/navigation/navigationEdit'

export default {
  name: 'NavigationList',
  components: { Operate, NavigationEdit },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    langTypeEnums () {
      return this.getEnumsByName('LangType')
    },
    navigationTypeEnums () {
      return this.getEnumsByName('NavigationType')
    }
  },
  data () {
    return {
      roles: [],
      operate: 'add',
      boxShow: false,
      boxTitle: '添加导航',
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
      item: {},
      columns: [
        {
          title: 'ID',
          width: 60,
          key: 'id'
        },
        {
          title: '名称',
          width: 120,
          key: 'name'
        },
        {
          title: '导航类型',
          width: 80,
          key: 'type',
          render: (h, { row, column, index }) => {
            return h('span', {
              domProps: {
                innerHTML: this.getEnumLabelByValue('NavigationType', row.type)
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
          title: '父级ID',
          width: 60,
          key: 'parent_id'
        },
        {
          title: '级别',
          width: 60,
          key: 'level'
        },
        {
          title: 'url',
          width: 200,
          key: 'url'
        },
        {
          title: '排序',
          width: 50,
          key: 'sort'
        },
        {
          title: '打开',
          width: 100,
          key: 'is_blank_target',
          render: (h, { row, column, index }) => {
            return h('span', {
              domProps: {
                innerHTML: row.is_blank_target ? '新窗口' : '当前窗口'
              }
            })
          }
        },
        {
          title: '隐藏',
          width: 80,
          key: 'hidden',
          render: (h, { row, column, index }) => {
            return h('span', {
              domProps: {
                innerHTML: row.hidden ? '是' : '否'
              }
            })
          }
        },
        {
          title: '操作',
          width: 200,
          render: (h, { row, column, index }) => {
            return h(Operate, {
              props: {
                need: { edit: true, del: true },
                rowData: row
              },
              on: {
                edit: this.editHandle,
                del: this.delHandle
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
      let params = { ...this.searchParams, ...this.page_info, sortBy: 'sort' }
      this.$api.getNavigationList(params).then(res => {
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
    // async getOrgs () {
    //   try {
    //     let param = { page: 1, limit: 1000 }
    //
    //     let res = await this.$api.getOrganizationList(param)
    //     if (res.code === 200) {
    //       const list = res.data.map(item => {
    //         return {
    //           value: item.id,
    //           label: item.name
    //         }
    //       })
    //       this.orgs = list
    //     } else {
    //       this.orgs = []
    //     }
    //   } catch (err) {
    //     this.$Message.error(err && err.desc ? err.desc : err)
    //     this.orgs = []
    //   }
    // },
    addHandle () {
      this.item = {}
      this.edit('添加导航信息', 'add')
    },
    edit (title, operate) {
      this.boxShow = true
      this.boxTitle = title
      this.operate = operate
    },
    editHandle (row) {
      this.item = { ...row }
      this.edit('编辑导航信息', 'update')
    },
    delHandle (row) {
      this.$api.delNavigation(row).then(res => {
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
    }
  }
}
</script>

<style scoped>

</style>
