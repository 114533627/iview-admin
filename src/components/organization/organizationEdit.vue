<script>
import UploadMedia from '../common/UploadMedia'
import { mapGetters } from 'vuex'
import Editor from '_c/editor'
export default { name: 'OrganizationEdit', components: { Editor, UploadMedia }, props: { item: { type: Object }, operate: String }, watch: { item () { this.form = this.item } }, computed: { ...mapGetters(['getEnumsByName', 'getEnumLabelByValue']), orgTypeEnums () { return this.getEnumsByName('OrgType') }, langTypeEnums () { return this.getEnumsByName('LangType') } }, created () { this.form = this.item }, mounted () { }, beforeDestroy () { console.log('organizationEdit destroyed') }, data () { return { loading1: false, options1: [], form: {}, rules: { } } }, methods: { uploadOverHandle (filelist, field) { if (filelist.length > 0) this.form[field] = filelist[0].url else this.form[field] = '' }, changeEditorHandle (html) { this.form.introduction = html }, async remoteSearchHandle (query) { if (query !== '') { this.loading1 = true let param = { page: 1, limit: 1000, kwd: query.trim() } try { let res = await this.$api.getOrganizationList(param) this.loading1 = false console.log(res) if (res.code === 200) { const list = res.data.map(item => { return { value: item.id, label: item.name } }) console.log(list) this.options1 = list } else { this.options1 = [] } } catch (e) { this.$Message.error(e) this.options1 = [] } } else { this.options1 = [] } }, handleCancel () { console.log('cancel edit') }, handleSubmit () { this.$refs.form.validate(async (valid) => { if (valid) { let res = null if (this.operate === 'add') { res = await this.$api.addOrganization(this.form) } else { res = await this.$api.addOrganization(this.form) } if (res != null && res.code === 200) { this.$Message.success(this.operate === 'add' ? '添加成功' : '保存成功') } else { this.$Message.error((this.operate === 'add' ? '添加' : '保存') + `失败 ${res.desc}`) } this.$emit('editOk') } }) } }
}
</script>

<style scoped>

</style>
