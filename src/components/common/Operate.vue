<template>
  <div class="operate">
    <Button v-if="need.detail" type="default" @click="detail()">详情</Button>
    <Button v-if="need.edit" type="default" @click="edit()">编辑</Button>
    <Button v-if="need.del" type="default" @click="del()">删除</Button>
  </div>
</template>

<script>
/**
   * 对数据行的基本操作
   */
export default {
  name: 'Operate',
  props: {
    need: {
      type: Object,
      default: () => ({
        detail: true,
        edit: true,
        del: true
      })
    },
    rowData: Object
  },
  data () {
    return {

    }
  },
  methods: {
    detail () {
      this.$emit('detail', this.rowData)
    },
    edit () {
      this.$emit('edit', this.rowData)
    },
    del () {
      this.$Modal.confirm({
        title: 'Title',
        content: '<p>确认删除吗？</p>',
        onOk: () => {
          this.$emit('del', this.rowData)
        },
        onCancel: () => {
        }
      })
    }
  }

}
</script>

<style scoped lang="less">
.operate {
  display: flex;
  flex-wrap: nowrap;
  /deep/ .ivu-btn {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
