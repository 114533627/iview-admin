<template>
  <div class="letter-page">
    <Row :gutter="10">
      <Col :span="8">
        <Card>
          <div class="center ptb10">
            <img class="ava mr20" :src="$store.state.user.avatarImgPath" alt="">
            <div class="center column">
              <h2>{{$store.state.user.userName}}</h2>
              <Button @click="addLetter" class="mt10" type="primary" shape="circle">私信其它成员</Button>
            </div>
          </div>
        </Card>
      </Col>
      <Col :span="16">
        <Card>
          <div class="flex">
            <div class="item" @click="selectType('')">
              <div class="title">消息</div>
              <div class="value">{{sta.total}}</div>
            </div>
            <div class="item" @click="selectType(0)">
              <div class="title">未读</div>
              <div class="value">{{sta.noReadNum}}</div>
            </div>
            <div class="item" @click="selectType(3)">
              <div class="title">已回复</div>
              <div class="value">{{sta.replyNum}}</div>
            </div>
            <div class="item" @click="selectType(2)">
              <div class="title">已发出私信</div>
              <div class="value">{{sta.startNum}}</div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
    <Row class="flex1 mt10 mh0" :gutter="10">
      <Col :span="8" class="hfill">
        <Card class="hfill bl-card column">
          <div class="flex acenter" slot="title">
            <div class="mr20">消息</div>
            <Select class="flex1" placeholder="请选择类型" clearable @on-change="changeStatus" v-model="onState" style="width:200px">
              <Option v-for="(item, index) in types" :value="index" :key="index">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="column hfill">
            <div class="flex1 meslist">
              <div class="center" v-if="!total">暂无数据</div>
              <div class="flex ptb10 acenter bb pointer" @click="selectLetter(item.id)" v-for="(item, index) in list" :key="index">
                <template v-if="item.type==='start'">
                  <img class="min-ava" :src="item.from_area.img_url">
                  <div class="flex1">
                    <div class="name">{{item.from_area.name_zh + ' / ' + item.from_area.name_en}}</div>
                    <div class="time">{{item.created_time}}</div>
                  </div>
                </template>
                <template v-else-if="item.type==='guest'">
                  <img class="min-ava" :src="item.to_area.img_url">
                  <div class="flex1">
                    <div class="name">{{item.to_area.name_zh + ' / ' + item.to_area.name_en}}</div>
                    <div class="time">{{item.created_time}}</div>
                  </div>
                </template>
                <template v-else-if="item.type==='reply'">
                  <img class="min-ava" :src="item.to_area.img_url">
                  <div class="flex1">
                    <div class="name">{{item.to_area.name_zh + ' / ' + item.to_area.name_en}}</div>
                    <div class="time">{{item.created_time}}</div>
                  </div>
                </template>
                <Icon type="ios-mail-outline" :size="25"/>
              </div>
            </div>
            <Page class="center pt10" :current.sync="page" :total="total" simple :page-size="limit"/>
          </div>
        </Card>
      </Col>
      <Col :span="16" class="hfill">
        <Card class="hfill" :class="onMessage.id ? 'br-card' : 'nodata'">
          <div v-show="onMessage.id" class="flex acenter" slot="title">
            <template v-if="onMessage.type==='start'">
              <img class="min-ava" :src="onMessage.from_area.img_url">
              <div class="flex1">
                <div class="name">{{onMessage.from_area.name_zh}}</div>
                <div class="time mt10">{{onMessage.created_time}}</div>
              </div>
            </template>
            <template v-else-if="onMessage.type==='guest'">
              <img class="min-ava" :src="onMessage.to_area.img_url">
              <div class="flex1">
                <div class="name">{{onMessage.to_area.name_zh}}</div>
                <div class="time mt10">{{onMessage.to_area.created_time}}</div>
              </div>
            </template>
            <template v-else-if="onMessage.type==='reply'">
              <img class="min-ava" :src="onMessage.to_area.img_url">
              <div class="flex1">
                <div class="name">{{onMessage.to_area.name_zh}}</div>
                <div class="time mt10">{{onMessage.to_area.created_time}}</div>
              </div>
            </template>
            <div>
              <Button class="mr10" type="primary" shape="circle" @click="delLetter" ghost>删除</Button>
              <Button type="primary" shape="circle" @click="replyLetter">回复</Button>
            </div>
          </div>
          <template v-if="onMessage.id">
            <div class="title">{{onMessage.title}}</div>
            <div class="content">{{onMessage.content}}</div>
            <div class="mt20" v-for="(file, index) in onMessage.attachments" :key="index">
              <div>
                <Button type="text" :to="file.url" target="_blank" :download="file.name" icon="ios-link">{{file.name}}</Button>
              </div>
            </div>
          </template>
          <template v-else>
            <Icon type="ios-arrow-dropleft" class="mr10" :size="32"/>
            <div>请选择私信</div>
          </template>
        </Card>
      </Col>
    </Row>
    <letter-edit :type="letterType" :toId="onMessage.id" @submit="reloadLetter" v-model="activeLetter"></letter-edit>
  </div>
</template>

<script>
import letterEdit from '../../components/letter/edit'
export default {
  name: 'letter',
  components: { letterEdit },
  props: {
    id: {
      type: [String, Number]
    }
  },
  data () {
    return {
      on: '',
      letterType: 'start',
      activeLetter: false,
      letterId: undefined,
      types: [
        { type: 'readStatus', label: '未读', value: 0 },
        { type: 'readStatus', label: '已读', value: 1 },
        { type: 'type', label: '发起', value: 'start' },
        { type: 'type', label: '回复', value: 'reply' },
        { type: 'type', label: '访客留言', value: 'guest' }
      ],
      list: [],
      onState: '',
      page: 1,
      total: 0,
      limit: 15,
      sta: {
        noReadNum: 0,
        replyNum: 0,
        startNum: 0,
        total: 0
      },
      onMessage: {
        id: undefined,
        from_area: {}
      }
    }
  },
  created () {
    if (this.id) {
      this.selectLetter(this.id)
    }
    this.getListData()
    this.getData()
  },
  watch: {
    id (val) {
      if (val) {
        this.selectLetter(this.id)
      }
    }
  },
  methods: {
    selectType (val) {
      this.onState = val
      this.changeStatus()
    },
    selectLetter (id) {
      this.$api.getMessage({ id }).then(res => {
        if (res.code === 200) {
          this.onMessage = { ...res.data, attachments: JSON.parse(res.data.attachments || '[]') }
          res.data.read_status === 0 && this.getListData()
        }
      }).catch(err => {
        this.$Message.error(err && err.desc ? err.desc : err)
      })
    },
    replyLetter (id) {
      // this.letterId = this.onMessage.id
      this.letterType = 'reply'
      this.activeLetter = true
      this.replyId = id
    },
    delLetter () {
      this.$Modal.confirm({
        title: '确定要删除吗？',
        content: '请谨慎操作！',
        onOk: () => {
          this.$api.delMessage({ id: this.onMessage.id }).then(res => {
            if (res.code === 200) {
              this.getListData()
              this.onMessage = { id: undefined, from_area: {} }
              this.$Message.success('删除成功')
            }
          }).catch(err => {
            this.$Message.error(err && err.desc ? err.desc : err)
          })
        }
      })
    },
    addLetter () {
      this.letterType = 'start'
      this.onMessage = {
        id: undefined,
        from_area: {}
      }
      this.activeLetter = true
    },
    reloadLetter () {
      this.page = 1
      this.$Message.success('发送成功！')
      this.getListData()
    },
    changeStatus () {
      this.page = 1
      // this.onMessage = { id: undefined, from_area: {} }
      this.getListData()
    },
    getData () {
      this.$api.getMessageNum().then(res => {
        this.sta = res.data
      }).catch((err) => {
        this.$Message.error(err && err.desc ? err.desc : err)
      })
    },
    getListData () {
      this.loading = true
      // let params = { ...this.searchParams, ...this.page_info, sortBy: 'sort' }
      let typeData = this.onState === '' || this.onState === undefined ? {} : { [this.types[this.onState].type]: this.types[this.onState].value }
      this.$api.getMessageList({ ...typeData, page: this.page, limit: this.limit }).then(res => {
        if (res.code === 200) {
          this.list = res.data
          this.total = res.page_info.total
        }
      }).catch(err => {
        this.$Message.error(err && err.desc ? err.desc : err)
      })
    }
  }
}
</script>
<style lang="less">
.bl-card {
  .ivu-card-head {
    background: #ECF0f3 !important;
    padding: 22.5px;
  }
  .ivu-card-body {
    flex: 1;
    min-height: 0;
  }
  .ivu-select-selection {
    border-radius: 20px;
    background: none !important;
    border: 1px solid #2b85e4;
    padding-left: 15px;
    .ivu-icon {
      color: #2b85e4;
    }
  }
}
.nodata {
  .ivu-card-head {
    padding: 0;
  }
  .ivu-card-body {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    color: #aaa;
    line-height: 1;
  }
}
.br-card {
  .ivu-card-head {
    background: #ECF0f3 !important;
    padding-left: 30px;
  }
}
</style>
<style lang="less" scoped>
.letter-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  .meslist {
    overflow-y: auto;
    min-height: 0;
    height: 100%;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .ava {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
  }
  .item {
    flex: 1;
    padding: 21px 0;
    text-align: center;
    cursor: pointer;
    .value {
      margin-top: 5px;
      font-size: 28px;
      color: #2b85e4;
    }
  }
  .min-ava {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
  }
  .time {
    font-size: 12px;
  }
  .br-card {
    .title {
      color: #2b85e4;
      font-size: 20px;
      margin-left: 15px;
      border-bottom: 1px solid #dcdee2;
      margin-bottom: 25px;
      padding-bottom: 10px;
    }
    .content {
      margin-left: 15px;
      white-space: pre-wrap;
    }
  }
}
</style>
