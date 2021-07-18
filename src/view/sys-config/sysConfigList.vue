<template>
  <Card>
    <div slot="title">
      <Form ref="form" :model="searchParams" inline>
        <FormItem prop="kwd">
          <Input v-model="searchParams.kwd" clearable placeholder="搜索关键词"></Input>
        </FormItem>
        <FormItem prop="type">
          <Select v-model="searchParams.type" clearable style="width:200px" placeholder="请选择类型">
            <Option v-for="item in sysConfigTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
      <sysConfig-edit ref="edit" :item="item" :operate="operate" @editOk="editOkHandle"></sysConfig-edit>
    </Modal>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import Operate from '../../components/common/Operate'
import SysConfigEdit from '../../components/sys-config/sysConfigEdit'

export default {
  name: 'SysConfigList',
  components: { Operate, SysConfigEdit },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    langTypeEnums () {
      return this.getEnumsByName('LangType')
    },
    sysConfigTypeEnums () {
      return this.getEnumsByName('SysConfigType')
    }
  },
  data () {
    return {
      roles: [],
      operate: 'add',
      boxShow: false,
      boxTitle: '添加配置',
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
          title: '标识',
          width: 120,
          key: 'code'
        },
        {
          title: '配置类型',
          width: 120,
          key: 'type',
          render: (h, { row, column, index }) => {
            return (row.type === 'text' ? '文本' : 'JSON')
          }
        },

        {
          title: '文本值',
          width: 120,
          key: 'val'
        },
        {
          title: 'JSON值',
          width: 300,
          key: 'json_val'
        },
        {
          title: '备注',
          width: 120,
          key: 'remark'
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
      let params = { ...this.searchParams, ...this.page_info }
      this.$api.getSysConfigList(params).then(res => {
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
      this.edit('添加配置信息', 'add')
    },
    edit (title, operate) {
      this.boxShow = true
      this.boxTitle = title
      this.operate = operate
    },
    editHandle (row) {
      this.item = { ...row }
      this.edit('编辑配置信息', 'update')
    },
    delHandle (row) {
      this.$api.delSysConfig(row).then(res => {
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
