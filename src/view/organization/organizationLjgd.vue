<template>
  <Card>
    <div slot="title">
      {{ljgdTitle}}
    </div>
    <article-edit v-if="show" ref="edit" :item="item" :operate="operate" :org-arti-type="orgArtiType" :show-footer="true" @editOk="editOkHandle"></article-edit>
  </Card>
</template>

<script>
import ArticleEdit from '../../components/article/articleEdit'
export default {
  name: 'organizationLjgd',
  components: { ArticleEdit },
  mounted () {

  },
  created () {
    this.getDataList()
  },
  computed: {
    ljgdTitle () {
      let { name } = this.$route.query
      return '机构：' + name + ' > 了解更多'
    },
    operate () {
      return this.item.id ? 'update' : 'add'
    }
  },
  data () {
    return {
      show: false,
      orgArtiType: 'ljgd',
      orgId: '',
      item: {}
    }
  },
  methods: {
    getDataList () {
      let { org_id, org_arti_type } = this.$route.query
      let params = { orgArtiType: org_arti_type, orgId: org_id, page: 1, limit: 1000 }
      this.$api.getArticleList(params).then(res => {
        if (res.code === 200) {
          if (res.data.length === 1) {
            this.item = res.data[0]
            this.show = true
          } else if (res.data.length === 0) {
            this.item = { org_arti_type: 'ljgd', org_id: org_id }
            this.show = true
          } else {
            this.$Message.error('了解更多的内容数量超过1，请检查')
          }
        }
      }).catch(err => {
        this.$Message.error(err && err.desc ? err.desc : err)
      })
    },
    editOkHandle () {

    }
  }
}
</script>

<style scoped>

</style>
