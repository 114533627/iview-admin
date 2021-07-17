<template>
  <Card>
    <div slot="title">
      <Form ref="form"  inline >
        <FormItem>
          {{title}}
        </FormItem>
        <FormItem >
          <Select v-model="objectId" clearable style="width:200px" placeholder="请选择要添加的区域机构">
            <Option v-for="item in areas" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Button type="primary" @click="addHandle">添加</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="delHandle">解除关联</Button>
        </FormItem>
      </Form>
    </div>
    <div class="content">
      <Table border :loading="loading" ref="selection" :columns="columns" :data="dataList"
             @on-selection-change="selectionChangeHandle"
      ></Table>
    </div>
  </Card>
</template>

<script>
import { mapGetters } from 'vuex'
import Operate from '../../components/common/Operate'

export default {
  name: 'AreaAreas',
  components: { Operate },
  props: { item: Object },
  computed: {
    ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']),
    areaTypeEnums () {
      return this.getEnumsByName('AreaType')
    },
    title () {
      let { name_zh } = this.item
      return '区域：' + name_zh + ' > 城市机构关联'
    }
  },
  data () {
    return {
      status: {
        show: true,
        text: '启用'
      },
      areas: [],
      objectId: '',
      loading: false,
      dataList: [],
      selectedRows: [],
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
          width: 60,
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
          width: 60,
          align: 'center',
          key: 'axis_x'
        },
        {
          title: 'y坐标',
          width: 60,
          align: 'center',
          key: 'axis_y'
        },
        {
          title: '中文机构ID',
          width: 60,
          align: 'center',
          key: 'zh_org_id'
        },
        {
          title: '英文机构ID',
          width: 60,
          align: 'center',
          key: 'en_org_id'
        },
        {
          title: '操作',
          width: 80,
          render: (h, { row, column, index }) => {
            return h(Operate, {
              props: {
                need: { status: { show: true, text: row.status === 0 ? '启用' : '停用' } },
                rowData: row
              },
              on: {
                status: this.statusHandle
              }
            })
          }
        }
      ]
    }
  },
  async created () {
    await this.getDataList()
    await this.getAreas()
  },
  mounted () {
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
    async getAreas () {
      try {
        // 查询机构号列表
        let param = { page: 1, limit: 1000, type: 2 }
        if (this.dataList.length) {
          param.exclude = this.dataList.map(item => item.id).join(',')
        }
        console.log(param)
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
    async getDataList () {
      if (!this.item.id) {
        return
      }
      this.loading = true
      let params = { id: this.item.id }
      await this.$api.getAreaAreas(params).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.dataList = res.data
        } else this.dataList = []
      }).catch(err => {
        this.loading = false
        this.dataList = []
        this.$Message.error(err && err.desc ? err.desc : err)
      })
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
    selectionChangeHandle (rows) {
      console.log(rows)
      this.selectedRows = rows
    },
    async addHandle () {
      if (this.item.id && this.objectId) {
        let param = { id: this.item.id, object_id: this.objectId }
        this.$api.addAreaAreas(param).then(async res => {
          if (res.code === 200) {
            this.$Message.success('添加成功')
            this.objectId = ''
            await this.getDataList()
            await this.getAreas()
          }
        })
      } else {
        this.$Message.warning('请选择机构区域')
      }
    },
    async delHandle () {
      if (this.item.id && this.selectedRows.length > 0) {
        for (let k in this.selectedRows) {
          let param = { id: this.item.id, object_id: this.selectedRows[k].id }
          await this.$api.delAreaAreas(param).then(async res => {
            if (res.code === 200) {
              this.$Message.success('解除成功')
              await this.getDataList()
              await this.getAreas()
            }
          })
        }
        this.selectedRows = []
      } else {
        this.selectedRows = []
        this.$Message.warning('请选择要解除的行')
      }
    }
  }
}
</script>

<style scoped>

</style>
