<template>
  <div class="operate">
    <Button v-if="need.detail && hasPermission('detail')" type="default" @click="clickHandle('detail')">详情</Button>
    <Button v-if="need.edit && hasPermission('edit')" type="default" @click="clickHandle('edit')">编辑</Button>
    <Button v-if="need.status && need.status.show && hasPermission('status')" type="default" @click="clickHandle2('status',need.status.text)">{{need.status.text}}</Button>
    <Button v-if="need.del && hasPermission('del')" type="default" @click="clickHandle2('del','删除')">删除</Button>
    <Button v-if="need.seo && hasPermission('seo')" type="default" @click="clickHandle('seo')">SEO</Button>
    <Button v-if="need.jujiao && hasPermission('jujiao')" type="default" @click="clickHandle('jujiao')">聚焦</Button>
    <Button v-if="need.ljgd && hasPermission('ljgd')" type="default" @click="clickHandle('ljgd')">了解更多</Button>
    <Button v-if="need.hdrl && hasPermission('hdrl')" type="default" @click="clickHandle('hdrl')">活动日历</Button>
    <Button v-if="need.hdrl && hasPermission('viewpoint')" type="default" @click="clickHandle('viewpoint')">创合TED</Button>
    <Button v-if="need.csdsj && hasPermission('csdsj')" type="default" @click="clickHandle('csdsj')">大事件</Button>
    <Button v-if="need.csjggx && hasPermission('csjggx')" type="default" @click="clickHandle('csjggx')">机构关联</Button>
    <Button v-if="need.role && hasPermission('role')" type="default" @click="clickHandle('role')">角色</Button>
    <Button v-if="need.priv && hasPermission('priv')" type="default" @click="clickHandle('priv')">权限</Button>
    <Button v-if="need.articleStatusPass && hasPermission('articleStatusPass')" type="default" @click="clickHandle2('articleStatusPass','审核通过')">通过</Button>
    <Button v-if="need.articleStatusNoPass && hasPermission('articleStatusNoPass')" type="default" @click="clickHandle2('articleStatusNoPass','审核不通过')">不通过</Button>
  </div>
</template>

<script>
/**
   * 对数据行的基本操作
   */
import { mapGetters } from 'vuex'
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
        viewpoint: false,
        csdsj: false,
        csjggx: false,
        role: false,
        priv: false,
        articleStatusPass: false,
        articleStatusNoPass: false

      })
    },
    rowData: Object,
    privCodes: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(['privilegesList'])
  },
  data () {
    return {

    }
  },
  methods: {
    hasPermission (key) {
      if (!this.privCodes[key]) return true
      let buttonCode = this.privCodes[key]
      let bool = this.privilegesList.some(item => item.type === 'button' && item.code === buttonCode)
      return bool
    },
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
