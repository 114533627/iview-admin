<template>
  <div>
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
      <FormItem label="角色ID" prop="id" >
        <Input v-model="form.id" disabled style="width: 60%" placeholder="角色ID"></Input>
      </FormItem>
      <FormItem label="角色名称" name="name">
        <Input v-model="form.name" style="width: 60%" disabled placeholder="角色名称"></Input>
      </FormItem>
<!--      <FormItem label="权限">-->
<!--        <treeselect v-model="privIds" :autoSelectAncestors="true"-->
<!--                    :autoSelectDescendants="true"  :autoDeselectDescendants="true" :flat="true" :multiple="true" :options="roots" />-->
<!--      </FormItem>-->
      <FormItem>
        <Tree :data="roots" show-checkbox multiple :check-strictly="true" @on-check-change="checkChangeHandle"></Tree>
      </FormItem>
      <FormItem v-show="showFooter">
        <Button type="primary" @click="handleCancel('form')">取消</Button>
        <Button @click="handleSubmit('form')" style="margin-left: 8px">确定</Button>
      </FormItem>
    </Form>

  </div>
</template>

<script>
// import Treeselect from '@riophae/vue-treeselect'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'RolePrivileges',
  components: { /*Treeselect */},
  props: {
    item: {
      type: Object
    },
    showFooter: {
      type: Boolean,
      default: () => false
    }
  },
  watch: {
    item () {
      this.roots = []
      this.form = { ...this.item }
      this.privIds = this.item && this.item.privileges_list ? this.item.privileges_list.map(item => item.id) : []
      this.getPrivs()
    }
  },
  computed: {
  },
  async created () {
    this.form = { ...this.item }
    this.privIds = this.item && this.item.privileges_list ? this.item.privileges_list.map(item => item.id) : []
    this.getPrivs()
  },
  mounted () {
  },
  beforeDestroy () {
  },
  data () {
    return {
      form: {},
      rules: {
      },
      privIds: [],
      roots2: [],
      // define options
      roots: [
      //   {
      //   id: 'a',
      //   label: 'a',
      //   children: [ {
      //     id: 'aa',
      //     label: 'aa'
      //   }, {
      //     id: 'ab',
      //     label: 'ab'
      //   } ]
      // }, {
      //   id: 'b',
      //   label: 'b'
      // }, {
      //   id: 'c',
      //   label: 'c'
      // }
      ]
    }
  },
  methods: {
    async getPrivs () {
      try {
        let param = { page: 1, limit: 10000 }

        let res = await this.$api.getPrivilegesList(param)
        if (res.code === 200) {
          let list = res.data

          list.forEach(item => {
            if (this.privIds.includes(item.id)) item.checked = true
          })

          // 组织成树
          this.roots = list.filter(item => item.parent_id === 0).map(item => {
            let obj = { ...item }
            obj.label = obj.name
            obj.title = obj.name
            return obj
          })
          for (let i = 0; i < this.roots.length; i++) {
            let root = this.roots[i]
            this.setChildren(root, list)
          }
        } else {
          this.roots = []
        }
      } catch (err) {
        this.$Message.error(err && err.desc ? err.desc : err)
        this.roots = []
      }
    },
    setChildren (root, list) {
      let children = []
      root.children = children
      root.label = root.name
      root.title = root.name
      for (let i = 0; i < list.length; i++) {
        if (list[i].parent_id === root.id) {
          this.setChildren(list[i], list)
          children.push(list[i])
        }
      }
    },
    checkChangeHandle (nodes) {
      this.privIds = nodes.map(item => item.id)
    },
    handleCancel () {
      console.log('cancel edit')
      if (this.showFooter) {
        this.closeTag(this.$route)
      }
    },
    handleSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            let params = { role_id: this.form.id, priv_ids: this.privIds }
            let res = await this.$api.saveRolePrivileges(params)

            if (res != null && res.code === 200) {
              this.$Message.success('保存成功')
            } else {
              this.$Message.error(`保存失败 ${res.desc}`)
            }
          } catch (res) {
            this.$Message.error(`保存失败 ${res.desc}`)
          }
          if (this.showFooter) {
            this.closeTag(this.$route)
          } else {
            this.$emit('editOk')
          }
        } else {
          this.$Message.info('表单校验未通过，请检查')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
