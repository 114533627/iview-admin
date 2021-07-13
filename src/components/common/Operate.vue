<template>
  <div class="operate">
    <Button v-if="need.detail" type="default" @click="clickHandle('detail')">详情</Button>
    <Button v-if="need.edit" type="default" @click="clickHandle('edit')">编辑</Button>
    <Button v-if="need.status && need.status.show" type="default" @click="clickHandle2('status',need.status.text)">{{need.status.text}}</Button>
    <Button v-if="need.del" type="default" @click="clickHandle2('del','删除')">删除</Button>
    <Button v-if="need.seo" type="default" @click="clickHandle('seo')">SEO</Button>
    <Button v-if="need.jujiao" type="default" @click="clickHandle('jujiao')">聚焦</Button>
    <Button v-if="need.ljgd" type="default" @click="clickHandle('ljgd')">了解更多</Button>
    <Button v-if="need.hdrl" type="default" @click="clickHandle('hdrl')">活动日历</Button>
    <Button v-if="need.csdsj" type="default" @click="clickHandle('csdsj')">大事件</Button>
    <Button v-if="need.csjggx" type="default" @click="clickHandle('csjggx')">机构关联</Button>
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
        status: {
          show: false,
          text: ''
        },
        detail: true,
        edit: true,
        del: true,
        seo: true,
        jujiao: false,
        ljgd: false,
        hdrl: false,
        csdsj: false,
        csjggx: false
      })
    },
    rowData: Object
  },
  data () {
    return {

    }
  },
  methods: {
    clickHandle (type) {
      this.$emit(type, this.rowData)
    },
    clickHandle2 (type, text) {
      this.$Modal.confirm({
        title: '确认',
        content: `<p>确认${text}吗？</p>`,
        onOk: () => {
          this.$emit(type, this.rowData)
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
  width: 100%;
  flex-wrap: nowrap;
  justify-content: flex-start;
  /deep/ .ivu-btn {
    flex: 0 1 auto;
    margin: 0 2px;
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
