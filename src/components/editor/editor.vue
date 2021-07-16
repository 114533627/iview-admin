<template>
  <div class="editor-wrapper">
    <div :id="editorId">
      {{nullText}}
      <!--可使用 min-height 实现编辑区域自动增加高度-->
    </div>
  </div>
  <!--  <div class="editor-wrapper">-->
  <!--    <div :id="editorId"></div>-->
  <!--  </div>-->
</template>

<script>
import Editor from 'wangeditor'
import 'wangeditor/release/wangEditor.min.css'
import { oneOf } from '@/libs/tools'

export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
       * 绑定的值的类型, enum: ['html', 'text']
       */
    valueType: {
      type: String,
      default: 'html',
      validator: (val) => {
        return oneOf(val, ['html', 'text'])
      }
    },
    /**
       * @description 设置change事件触发时间间隔
       */
    changeInterval: {
      type: Number,
      default: 200
    },
    /**
       * @description 是否开启本地存储
       */
    cache: {
      type: Boolean,
      default: true
    },
    uploadParam: {
      type: Object
    }
  },
  watch: {
    value () {
      this.setHtml(this.value)
    }
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  data () {
    return {
      nullText: ''
    }
  },
  methods: {
    setHtml (val) {
      this.editor.txt.html(val)
    },
    async uploadImg (files, insert) {
      if (files) {
        for (let i = 0; i < files.length; i++) {
          let item = files[i]
          await this.uploadItem(item, insert)
        }
      }
    },
    async uploadItem (item, insert) {
      if (item) {
        let formData = new FormData()
        for (let key in this.uploadParam) {
          formData.append(key, this.uploadParam[key])
        }
        formData.append('file', item)
        let re = await this.$api.uploadImg(formData)
        let data = re
        if (data.code === 200) {
          this.$Message.success({
            type: 'success',
            message: '上传成功！'
          })
          // 将成功上传的图片插入富文本编辑器
          insert(data.data.preview_url)
        } else {
          this.$Message.error({ message: data.desc })
          console.log(data.desc)
        }
      }
    }
  },
  mounted () {
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.customConfig.onchange = (html) => {
      let text = this.editor.txt.text()
      if (this.cache) localStorage.editorCache = html
      this.$emit('input', this.valueType === 'html' ? html : text)
      this.$emit('on-change', html, text)
    }
    this.editor.customConfig.onchangeTimeout = this.changeInterval
    this.editor.customConfig.debug = true
    this.editor.customConfig.customUploadImg = (files, insert) => {
      this.uploadImg(files, insert)
    }
    // create这个方法一定要在所有配置项之后调用
    this.editor.create()
    // 如果本地有存储加载本地存储内容
    let html = this.value || localStorage.editorCache
    if (html) this.editor.txt.html(html)
  },
  beforeDestroy () {
    // this.editor._offAllEvent()
  }
}
</script>

<style lang="less">
  .editor-wrapper {
    z-index: 100 !important;
  }
</style>
