<template>
  <Card>
    <div slot="title">
      <Form ref="form" :model="searchParams" inline>
        <FormItem prop="kwd">
          <Input v-model="searchParams.kwd" clearable placeholder="搜索关键词"></Input>
        </FormItem>
        <FormItem prop="type">
          <Select v-model="searchParams.type" clearable style="width:200px" placeholder="请选择类型">
            <Option v-for="item in messageTypeEnums" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
      <message-edit ref="edit" :item="item" :operate="operate" @editOk="editOkHandle"></message-edit>
    </Modal>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import Operate from '../../components/common/Operate'
import MessageEdit from '../../components/message/messageEdit'

export default {
  name: 'MessageList',
  components: { Operate, MessageEdit },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    langTypeEnums () {
      return this.getEnumsByName('LangType')
    },
    messageTypeEnums () {
      return this.getEnumsByName('MessageType')
    }
  },
  data () {
    return {
      roles: [],
      operate: 'add',
      boxShow: false,
      boxTitle: '添加消息',
      loading: false,
      dataList: [],
      searchParams: {
        kwd: '',
        sortBy: 'desc',
        orderBy: 'created_time'
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
          title: '消息类型',
          width: 80,
          key: 'type',
          render: (h, { row, column, index }) => {
            return h('span', {
              domProps: {
                innerHTML: this.getEnumLabelByValue('MessageType', row.type)
              }
            })
          }
        },
        {
          title: '发送者',
          width: 80,
          key: 'from_area',
          render: (h, { row, column, index }) => {
            return h('span', {
              domProps: {
                innerHTML: row.from_area ? row.from_area.name_zh : ''
              }
            })
          }
        },
        {
          title: '接收者',
          width: 80,
          key: 'to_area',
          render: (h, { row, column, index }) => {
            return h('span', {
              domProps: {
                innerHTML: row.to_area ? row.to_area.name_zh : ''
              }
            })
          }
        },
        {
          title: '留言者姓名',
          width: 80,
          key: 'nickname'
        },
        {
          title: '留言者email',
          width: 100,
          key: 'email'
        },
        {
          title: '内容',
          width: 300,
          key: 'content'
        },
        {
          title: '时间',
          width: 130,
          key: 'created_time'
        },
        {
          title: '操作',
          width: 200,
          render: (h, { row, column, index }) => {
            return h(Operate, {
              props: {
                need: { detail: true, del: true },
                rowData: row
              },
              on: {
                detail: this.detailHandle,
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
      this.$api.getMessageList(params).then(res => {
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
      this.edit('添加消息信息', 'add')
    },
    edit (title, operate) {
      this.boxShow = true
      this.boxTitle = title
      this.operate = operate
    },
    detailHandle (row) {
      this.item = { ...row }
      this.edit('编辑消息信息', 'update')
    },
    delHandle (row) {
      this.$api.delMessage(row).then(res => {
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
