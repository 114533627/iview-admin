<template>
  <div>
    <Modal v-model="active" :title="modalTitle[type]">
      <Form ref="form" :model="form" :rules="rules" :label-width="50">
        <FormItem label="用户" prop="to_area_id" >
          <Select v-model="form.to_area_id" clearable placeholder="请选择管理的区域">
            <Option v-for="(item, index) in users" :value="item.area_id" :key="index">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="标题" prop="title">
          <Input v-model="form.title" placeholder="姓名"></Input>
        </FormItem>
        <FormItem label="内容" prop="content">
          <Input type="textarea" v-model="form.content" placeholder="姓名"></Input>
        </FormItem>
        <FormItem label="附件" prop="avatar">
          <upload-file type="message" v-model="form.attachments"></upload-file>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="handleCancel('form')">取消</Button>
        <Button :loading="loading" type="primary" @click="handleSubmit('form')" style="margin-left: 8px">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import UploadFile from '../common/UploadFile'
import Editor from '_c/editor'
export default {
  name: 'LetterEdit',
  components: { Editor, UploadFile },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'start'
    }
  },
  data () {
    return {
      loading: false,
      showFooter: false,
      modalTitle: {
        start: '创建私信',
        reply: '回复私信',
        guest: '回复访客留言'
      },
      users: [],
      form: {
        title: '',
        content: '',
        to_area_id: '',
        attachments: []
      },
      rules: {
        to_area_id: [{ required: true, message: '请选择用户' }],
        title: [{ required: true, message: '请输入标题' }],
        content: [{ required: true, message: '请输入内容' }]
      }
    }
  },
  watch: {
    id () {
      this.form = { ...this.item }
    }
  },
  computed: {
    active: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  async created () {
    this.getUsers()
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    async getUsers () {
      this.$api.getUserList({ limit: 5000, page: 1 }).then(res => {
        if (res.code === 200) {
          this.users = res.data
        }
      }).catch(err => {
        this.$Message.error(err && err.desc ? err.desc : err)
      })
    },
    handleCancel () {
      this.active = false
    },
    handleSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.addMessage({ ...this.form, id: this.id, type: this.type, attachments: JSON.stringify(this.form.attachments) }).then(res => {
            this.loading = false
            if (res.code === 200) {
              this.$emit('submit')
              this.active = false
            }
          }).catch(err => {
            this.loading = false
            this.$Message.error(err && err.desc ? err.desc : err)
          })
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
