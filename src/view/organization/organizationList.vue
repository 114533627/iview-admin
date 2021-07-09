<template>
  <Card>
    <div slot="title">
      <Form ref="form" :model="searchParams" inline>
        <FormItem prop="kwd">
          <Input v-model="searchParams.kwd" placeholder="搜索关键词"></Input>
        </FormItem>
        <FormItem prop="lang">
          <Select v-model="searchParams.lang" clearable style="width:200px" placeholder="请选择语言">
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
    </div>
    <Modal
      v-model="boxShow"
      width="1000"
      :title="boxTitle"
      @on-ok="okHandle"
      @on-cancel="cancelHandle">
      <organization-edit ref="edit" :item="item" :operate="operate" @editOk="editOkHandle"></organization-edit>
    </Modal>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import Operate from '../../components/common/Operate'
import OrganizationEdit from '../../components/organization/organizationEdit'

export default {
  name: 'OrganizationList',
  components: { Operate, OrganizationEdit },
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
          title: '操作',
          width: 120,
          render: (h, { row, column, index }) => {
            return h(Operate, {
              props: {
                need: { detail: false, edit: true, del: true },
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
  created () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.loading = true
      let params = { ...this.searchParams, ...this.page_info }
      this.$api.getOrganizationList(params).then(res => {
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
      this.item = {}
      this.edit('添加机构信息', 'add')
    },
    edit (title, operate) {
      this.boxShow = true
      this.boxTitle = title
      this.operate = operate
    },
    editHandle (row) {
      this.item = row
      this.edit('编辑机构信息', 'update')
    },
    delHandle (row) {
      this.item = row
    },
    okHandle () {
      this.$refs.edit.handleSubmit()
    },
    cancelHandle () {
      this.$refs.edit.handleCancel()
    },
    editOkHandle () {
      this.getDataList()
    }
  }
}
</script>

<style scoped>

</style>
