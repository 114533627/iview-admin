<template>
  <Upload
    ref="upload"
    :action="actionUrl"
    :headers="headers"
    :multiple="max>1"
    :data="{type: type}"
    :max-size="1024*50"
    :before-upload="handleBeforeUpload"
    :on-format-error="handleFormatError"
    :on-exceeded-size="handleMaxSize"
    :on-success="handleSuccess">
    <Button icon="ios-cloud-upload-outline">Upload files</Button>
  </Upload>
</template>

<script>
import store from '@/store/index.js'
export default {
  props: {
    max: {
      type: Number,
      default: 2
    },
    type: {
      type: String
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      headers: {
        Authorization: 'Bearer ' + store.getters.token
      },
      actionUrl: '/api/v1/common/upload_file',
      files: this.value
    }
  },
  watch: {
    value (newValue, oldValue) {
      this.files = newValue
      console.log(666)
    }
  },
  methods: {
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 20M.'
      })
    },
    handleBeforeUpload (files) {
      let bool = this.$refs.upload.fileList.length < this.max
      if (!bool) {
        this.$Message.warning('Up to ' + this.max + ' pictures can be uploaded.')
      }
      return bool
    },
    handleSuccess (res, file) {
      if (res.code !== 200) {
        this.$Message.error({ content: res.desc, duration: 5 })
        return
      }
      file.url = res.data.preview_url
      file.id = res.data.id
      this.files.push({ url: res.data.preview_url, id: res.data.id, name: res.data.name })
      this.$emit('input', this.files)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
