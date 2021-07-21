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
      <area-edit ref="edit" :item="item" :operate="operate" @editOk="editOkHandle"></area-edit>
    </Modal>
    <Modal
      ref="csjggxModal"
      v-model="boxShow2"
      width="1000"
      title="城市机构关联"
      @on-ok="okHandle"
      @on-cancel="cancelHandle">
      <area-areas ref="csjggx" :item="item" @editOk="editOkHandle"></area-areas>
    </Modal>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import Operate from '../../components/common/Operate'
import AreaEdit from '../../components/area/areaEdit'
import AreaAreas from '../../components/area/areaAreas'

export default {
  name: 'areaList',
  components: { Operate, AreaEdit, AreaAreas },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    langTypeEnums () {
      return this.getEnumsByName('LangType')
    },
    areaTypeEnums () {
      return this.getEnumsByName('AreaType')
    }
  },
  data () {
    return {
      status: {
        show: true,
        text: '启用'
      },
      areas: [],
      boxShow2: false,
      operate: 'add',
      boxShow: false,
      boxTitle: '添加区域',
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
          title: '父级',
          width: 120,
          key: 'parent_id',
          render: (h, { row, column, index }) => {
            return h('span',
              {
                domProps: {
                  innerHTML: (({ parent_id }) => {
                    if (!parent_id) return ''
                    for (let i = 0; i < this.areas.length; i++) {
                      if (this.areas[i].value === parent_id) return this.areas[i].label
                    }
                    return parent_id
                  })(row)
                }
              }
            )
          }
        },
        {
          title: '中文名称',
          width: 120,
          key: 'name_zh'
        },
        {
          title: '英文名称',
          width: 120,
          key: 'name_en'
        },
        {
          title: '类型',
          width: 80,
          key: 'type',
          render: (h, { row, column, index }) => {
            return h('span', {
              domProps: {
                innerHTML: this.getEnumLabelByValue('AreaType', row.type)
              }
            })
          }
        },
        {
          title: '所属用户',
          width: 80,
          key: 'username'
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
          title: 'x坐标',
          width: 80,
          align: 'center',
          key: 'axis_x'
        },
        {
          title: 'y坐标',
          width: 80,
          align: 'center',
          key: 'axis_y'
        },
        {
          title: '中文机构ID',
          width: 100,
          align: 'center',
          key: 'zh_org_id'
        },
        {
          title: '英文机构ID',
          width: 100,
          align: 'center',
          key: 'en_org_id'
        },
        {
          title: '操作',
          width: 200,
          render: (h, { row, column, index }) => {
            return h(Operate, {
              props: {
                need: { status: { show: true, text: row.status === 0 ? '启用' : '停用' }, edit: true, del: true, csjggx: row.type === 1 || row.type === -1 },
                rowData: row
              },
              on: {
                edit: this.editHandle,
                del: this.delHandle,
                status: this.statusHandle,
                csjggx: this.csjggxHandle
              }
            })
          }
        }
      ]
    }
  },
  async created () {
    await this.getAreas()
    await this.getDataList()
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
    async getDataList () {
      this.loading = true
      let params = { ...this.searchParams, ...this.page_info }
      await this.$api.getAreaList(params).then(res => {
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
    async getAreas () {
      try {
        let param = { page: 1, limit: 1000 }
        let res = await this.$api.getAreaList(param)
        if (res.code === 200) {
          const list = res.data.map(item => {
            return {
              value: item.id,
              label: item.name_zh
            }
          })
          this.areas = list
        } else {
          this.areas = []
        }
      } catch (err) {
        this.$Message.error(err && err.desc ? err.desc : err)
        this.areas = []
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
    statusHandle (row) {
      this.$api.updateAreaStatus({ id: row.id, status: row.status === 0 ? 1 : 0 }).then(res => {
        if (res.code === 200) {
          this.$Message.success('操作成功')
          this.getDataList()
        } else {
          this.$Message.error(res.desc)
        }
      }).catch(res => this.$Message.error(res && res.desc ? res.desc : res))
    },
    // 城市机构关系
    csjggxHandle (row) {
      this.item = { ...row }
      this.boxShow2 = true
    }
  }
}
</script>

<style scoped>

</style>
