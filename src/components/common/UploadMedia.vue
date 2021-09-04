<template>
  <div>
    <div class="demo-upload-list" v-for="item in selfDefaultList" :key="item.url">
  <!--    v-if="item.status === 'finished'"-->
      <template v-if="item.url">
        <img :src="item.url" v-if="/\.(png|jpg|gif|jpeg|webp)$/.test(item.url)">
        <video :src="item.url" v-if="/\.(mp4|avi)$/i.test(item.url)" controls="controls" width="500" height="400"></video>
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
<!--      <template v-else>-->
<!--        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>-->
<!--      </template>-->
    </div>
    <Upload
      :ref="uploadRef"
      :show-upload-list="false"
      :default-file-list="selfDefaultList"
      :on-success="handleSuccess"
      :on-error="handleError"
      :format="['jpg','jpeg','png','mp4','avi']"
      :max-size="20480"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :multiple="max>1"
      :data="uploadParam"
      :headers="headers"
      :disabled="selfDefaultList.length>=max"
      type="drag"
      :action="actionUrl"
      style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal :title="imgName" v-model="visible">
      <img :src="previewUrl" v-if="/\.(png|jpg|gif|jpeg|webp)$/.test(previewUrl)" :alt="imgName" style="width: 100%">
      <video :src="previewUrl" v-if="/\.(mp4|avi)$/i.test(previewUrl)" controls="controls" style="width: 100%"></video>
    </Modal>
  </div>
</template>
<script>
import store from '@/store/index.js'
export default {
  name: 'UploadMedia',
  props: {
    max: {
      type: Number,
      default: () => (1)
    },
    defaultList: {
      type: Array,
      default: () => [
        {
          'name': '',
          'url': ''
        }
      ]
    },
    uploadParam: {
      type: Object
    }
  },
  watch: {
    defaultList () {
      this.selfDefaultList = [...this.defaultList]
    }
  },
  computed: {
    uploadRef () {
      return `upload${this._uid}`
    }
  },
  data () {
    return {
      imgName: '',
      previewUrl: '',
      visible: false,
      uploadList: [],
      selfDefaultList: [...this.defaultList],
      headers: {
        Authorization: 'Bearer ' + store.getters.token
      },
      actionUrl: '/api/v1/common/upload_file'
    }
  },
  methods: {
    reset () {
      // this.uploadList = []
    },
    handleView (item) {
      this.imgName = item.name
      this.previewUrl = item.url
      this.visible = true
    },
    async handleRemove (file) {
      try {
        await this.$api.delMedia({ preview_url: file.url })
        const fileList = this.$refs[this.uploadRef].fileList
        this.$refs[this.uploadRef].fileList.splice(fileList.indexOf(file), 1)
        this.selfDefaultList = this.selfDefaultList.filter(item => item.url !== file.url)
        this.$emit('uploadOver', this.selfDefaultList)
      } catch (err) {
        this.$Message.error(e.desc)
      }
    },
    handleSuccess (res, file) {
      if (res.code !== 200) {
        this.$Message.error({ content: res.desc, duration: 5 })
        return
      }
      file.url = res.data.preview_url
      file.id = res.data.id
      this.selfDefaultList.push({ url: res.data.preview_url, id: res.data.id, name: res.data.name })
      this.$emit('uploadOver', this.selfDefaultList)
    },
    handleError () {

    },
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
    handleBeforeUpload () {
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
        })
      }
      return check
    }
  },
  mounted () {
    // this.uploadList = this.$refs[this.uploadRef].fileList
    console.log(this.uploadList)
  }
}
</script>
<style scoped>
  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }
  .demo-upload-list video {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
