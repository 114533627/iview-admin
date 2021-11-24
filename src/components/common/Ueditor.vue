<template>
  <div >
    <vue-ueditor-wrap :editor-id="editorId" :editor-dependencies="editorDependencies"  v-model="msg" :config="myConfig" @ready="readyHandle" @before-init="beforeInit"></vue-ueditor-wrap>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'

export default {
  name: 'Ueditor',
  components: {
    VueUeditorWrap
  },
  props: {
    value: {
      type: String,
      default () {
        return ''
      }
    },
    uploadParam: {
      type: Object
    }
  },
  watch: {
    value () {
      this.msg = this.value
    },
    msg () {
      this.$emit('input', this.msg)
    }
  },
  created () {
    this.msg = this.value
    this.myConfig = {
      autoHeightEnabled: false, // 编辑器不自动被内容撑高
      initialFrameHeight: 500, // 初始容器高度
      initialFrameWidth: '100%', // 初始宽度
      serverUrl: '/api/sys/ueditor/exec', // 上传文件接口
      headers: { Authorization: 'Bearer ' + this.$store.getters.token },
      UEDITOR_HOME_URL: '/UEditor/', // UEditor 资源文件的存放路径
      zIndex: 9000 // 层级
    }
    this.editorDependencies = [
      'ueditor.config.js',
      'ueditor.all.min.js',
      'lang/zh-cn/zh-cn.js'
    ]
  },
  data () {
    return {
      editorId: parseInt(Math.random() * 1000000) + '',
      editor: null,
      msg: '',
      myConfig: {},
      editorDependencies: [ ]
    }
  },
  methods: {
    readyHandle (editor) {
      this.editor = editor
    },
    beforeInit (editorId) {
      // console.log('editorId:', editorId)

      if (!UE.Editor.prototype._bkGetActionUrl) UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl
      UE.Editor.prototype.getActionUrl = function (action) {
        let actionUrl = ''
        if (action === 'uploadimage') {
          actionUrl = '/api/v1/common/ueditor/upload_file'
        } else if (action === 'uploadvideo') {
          actionUrl = '/api/v1/common/ueditor/upload_file'
        } else if (action === 'config') {
          actionUrl = '/UEditor/my_ueditor.json'
        } else {
          return UE.Editor.prototype._bkGetActionUrl.call(this, action)
        }
        if (this.uploadParam) {
          for (let key in this.uploadParam) {
            actionUrl = (actionUrl.indexOf('?') !== -1 ? '&' : '?') + key + '=' + this.uploadParam[key]
          }
        }
        return actionUrl
      }
    }
  },
  mounted () {
    // setTimeout(() => this.beforeInit(), 1000)
  },
  destroyed () {
    // if (this.editor) this.editor.destroy()
  }
}
</script>

<style scoped>

</style>
