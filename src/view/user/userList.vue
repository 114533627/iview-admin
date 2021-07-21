<template>
  <Card>
    <div slot="title">
      <Form ref="form" :model="searchParams" inline>
        <FormItem prop="kwd">
          <Input v-model="searchParams.kwd" clearable placeholder="搜索关键词"></Input>
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
      <user-edit ref="edit" :item="item" :operate="operate" @editOk="editOkHandle"></user-edit>
    </Modal>
    <Modal
      ref="roleModal"
      v-model="boxShow2"
      width="1000"
      title="用户角色"
      @on-ok="okHandle2"
      @on-cancel="cancelHandle2">
      <user-role ref="role" :item="item" :operate="operate" @editOk="editOkHandle"></user-role>
    </Modal>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import Operate from '../../components/common/Operate'
import UserEdit from '../../components/user/userEdit'
import UserRole from '../../components/user/userRole'

export default {
  name: 'userList',
  components: { Operate, UserEdit, UserRole },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    langTypeEnums () {
      return this.getEnumsByName('LangType')
    },
    userTypeEnums () {
      return this.getEnumsByName('UserType')
    }
  },
  data () {
    return {
      roles: [],
      operate: 'add',
      boxShow: false,
      boxShow2: false,
      boxTitle: '添加用户',
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
          title: '姓名',
          width: 120,
          key: 'name'
        },
        {
          title: '用户名',
          width: 120,
          key: 'username'
        },
        {
          title: '性别',
          width: 80,
          key: 'gender',
          render: (h, { row, column, index }) => {
            return h('span', {
              domProps: {
                innerHTML: (row.gender === 'woman') ? '女' : '男'
              }
            })
          }
        },
        {
          title: '电话',
          width: 100,
          key: 'phone'
        },
        {
          title: '头像',
          width: 80,
          align: 'center',
          key: 'avatar',
          render: (h, { row, column, index }) => {
            return h('img', {
              attrs: {
                src: row.avatar
              },
              'class': 'list-img'
            })
          }
        },
        {
          title: 'email',
          width: 180,
          key: 'email'
        },
        {
          title: '区域ID',
          width: 80,
          align: 'center',
          key: 'area_id'
        },
        {
          title: '操作',
          width: 200,
          render: (h, { row, column, index }) => {
            return h(Operate, {
              props: {
                need: { edit: true, del: true, role: true },
                rowData: row
              },
              on: {
                edit: this.editHandle,
                del: this.delHandle,
                role: this.roleHandle
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
      this.$api.getUserList(params).then(res => {
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
      this.edit('添加用户信息', 'add')
    },
    edit (title, operate) {
      this.boxShow = true
      this.boxTitle = title
      this.operate = operate
    },
    editHandle (row) {
      this.item = { ...row }
      this.edit('编辑用户信息', 'update')
    },
    delHandle (row) {
      this.$api.delUser(row).then(res => {
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
    statusHandle (row) {
      this.$api.updateUserStatus({ id: row.id, status: row.status === 0 ? 1 : 0 }).then(res => {
        if (res.code === 200) {
          this.$Message.success('操作成功')
          this.getDataList()
        } else {
          this.$Message.error(res.desc)
        }
      }).catch(res => this.$Message.error(res && res.desc ? res.desc : res))
    },
    // 城市机构关系
    roleHandle (row) {
      this.item = row
      this.boxShow2 = true
    },
    okHandle2 () {
      this.$refs.role.handleSubmit()
    },
    cancelHandle2 () {
      this.$refs.role.handleCancel()
    }
  }
}
</script>

<style scoped>

</style>
