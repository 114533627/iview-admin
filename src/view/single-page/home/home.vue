<template>
  <div class="page">
    <Row :gutter="10">
      <Col span="16">
        <Card>
          <div class="header">
            <div class="ava-wrapper">
              <img class="ava" :src="$store.state.user.avatarImgPath" alt="">
              <Tag color="primary">{{type}}</Tag>
            </div>
            <div class="flex1">
              <div class="flex bb acenter">
                <div class="flex1">
                  <h2>{{$store.state.user.userName}}</h2>
                  <div class="area">所属区域：{{area}}</div>
                </div>
                <RadioGroup @on-change="getTabsData" v-if="lang.length > 1" v-model="lang" type="button" size="large">
                  <Radio label="zh">中文</Radio>
                  <Radio label="en">英文</Radio>
                </RadioGroup>
              </div>
              <div class="nums mt10">
                <div class="column-center">
                  <div class="title">介绍</div>
                  <div class="value">1</div>
                </div>
                <div class="column-center" v-if="tabs[lang][4]">
                  <div class="title">大事件</div>
                  <div class="value">{{tabs[lang][4].total}}</div>
                </div>
                <div class="column-center" v-if="tabs[lang][3]">
                  <div class="title">活动日历</div>
                  <div class="value">{{tabs[lang][3].total}}</div>
                </div>
                <div class="column-center">
                  <div class="title">站内私信</div>
                  <div class="value">{{total}}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Col>
      <Col span="8">
        <Card>
          <div class="links">
            <router-link to="/letter/letter" class="item">
              <Icon type="ios-chatboxes" :size="25"/>
              <div class="name">查看私信</div>
            </router-link>
            <router-link to="/article/list" class="item">
              <Icon type="ios-briefcase" :size="25"/>
              <div class="name">发布活动</div>
            </router-link>
            <router-link to="/article/list" class="item">
              <Icon type="md-images" :size="25"/>
              <div class="name">发布介绍</div>
            </router-link>
            <router-link to="/article/list" class="item">
              <Icon type="ios-megaphone" :size="25"/>
              <div class="name">发布大事件</div>
            </router-link>
          </div>
        </Card>
      </Col>
    </Row>
    <div class="home-tab" v-if="tabs[lang].length">
      <Tabs type="card" v-model="onTab">
        <router-link v-if="onTab" :to="'/organization/jujiao?org_id='+tabs[lang][0].list[0].id+'&org_arti_type='+types[onTab]+'&name='+tabs[lang][0].list[0].name" slot="extra">
          <Button type="primary" shape="circle">查看全部</Button>
        </router-link>
        <router-link v-else to="/organization/list" slot="extra">
          <Button type="primary" shape="circle">查看全部</Button>
        </router-link>
        <TabPane :label="tab.name" v-for="(tab, index) in tabs[lang]" :key="index">
          <!-- <div class="flex hfill"> -->
            <Row :gutter="20" class="hfill">
              <Col :span="6" v-for="(item, index) in tab.list" :key="index">
                <div class="card">
                  <img class="card-img" :src="item[index===0?'bg_media_url':'img_url']" alt="">
                  <div class="main">
                    <div class="name">{{item.name}}</div>
                    <div class="desc">{{item[index===0?'remark':'introduction']}}</div>
                    <div class="bottom">
                      <div class="flex1">
                        <div class="title">Views</div>
                        <div class="value">123456</div>
                      </div>
                      <Button shape="circle" size="small" type="primary" ghost>编辑</Button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col :span="6" class="hfill" v-if="!tab.list.length || index>1">
                <div class="card add column-center hfill">
                  <Icon type="md-add" :size="50"/>
                </div>
              </Col>
            </Row>
          <!-- </div> -->
        </TabPane>
      </Tabs>
    </div>
    <div class="home-tab">
      <Tabs type="card">
        <router-link to="/letter/letter" slot="extra">
          <Button type="primary" shape="circle">查看全部</Button>
        </router-link>
        <TabPane label="私信">
          <Row :gutter="20">
            <Col :span="8" class="ptb10" v-for="(item, index) in letterList" :key="index">
              <div class="mes">
                <div class="mes-top">
                  <img class="ava" :src="item.from_area.img_url" alt="">
                  <div class="flex1">
                    <div class="name">{{item.nickname}}</div>
                    <div class="desc">{{item.content}}</div>
                  </div>
                </div>
                <div class="bottom">
                  <Icon type="ios-mail-outline" :size="23"/>
                  <div class="value flex1">{{item.read_status==1?'已读':'未读'}}</div>
                  <Button shape="circle" size="small" type="primary" ghost>编辑</Button>
                </div>
              </div>
            </Col>
            <Col :span="8" class="ptb10">
              <div class="mes flex1 add center">
                <Icon type="md-add" :size="50"/>
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      onTab: 0,
      inforCardData: [
        { title: '新增用户', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
        { title: '累计点击', icon: 'md-locate', count: 232, color: '#19be6b' },
        { title: '新增问答', icon: 'md-help-circle', count: 142, color: '#ff9900' },
        { title: '分享统计', icon: 'md-share', count: 657, color: '#ed3f14' },
        { title: '新增互动', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
        { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }
      ],
      pieData: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      },
      letterList: [],
      total: 0,
      tabs: {
        zh: [],
        en: []
      },
      lang: 'zh',
      types: ['', 'ljgd', 'jujiao', 'hdrl', 'csdsj']
    }
  },
  computed: {
    type () {
      if (!this.tabs[this.lang].length) return ''
      let item = this.tabs[this.lang][0].list[0] || {}
      return item.type === 'city' ? '城市号' : '全国号'
    },
    area () {
      if (!this.tabs[this.lang].length) return ''
      let item = this.tabs[this.lang][0].list[0] || {}
      return item.full_name || ''
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    getTabsData () {
      this.types.forEach((type, val) => {
        if (type && !this.tabs[this.lang][val].list.length) {
          this.$api.getArticleList({ orgId: this.tabs[this.lang][0].list[0].id, orgArtiType: type, page: 1, limit: 3, tab: 'self' }).then(res => {
            if (res.code === 200) {
              this.tabs[this.lang][val].list = res.data
              this.tabs[this.lang][val].total = res.page_info.total
            }
          }).catch(err => {
            this.$Message.error(err && err.desc ? err.desc : err)
          })
        }
      })
    },
    getDataList () {
      this.$api.getOrganizationList({ page: 1, limit: 2 }).then(res => {
        if (res.code === 200) {
          this.lang = res.data[0].lang
          this.tabs = Object.assign({}, ...res.data.map(item => ({
            [item.lang]: [
              { name: '介绍', list: [item], total: 1 },
              { name: '了解更多', list: [], total: 0 },
              { name: '聚焦', list: [], total: 0 },
              { name: '活动', list: [], total: 0 },
              { name: '大事件', list: [], total: 0 }
            ]
          })))
          this.getTabsData()
        }
      }).catch(err => {
        this.$Message.error(err && err.desc ? err.desc : err)
      })
      this.$api.getMessageList({ page: 1, limit: 5 }).then(res => {
        if (res.code === 200) {
          this.letterList = res.data
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
.home-tab > .ivu-tabs-card > .ivu-tabs-content {
  margin-top: -16px;
}

.home-tab > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
    background: #fff;
    padding: 16px;
}

.home-tab > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    border-color: transparent !important;
    background: none;
}
.home-tab > .ivu-tabs-card > .ivu-tabs-bar {
  border-bottom: 0 !important;
  padding-bottom: 10px;
}
.home-tab > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    border-color: #fff;
}
.page .ivu-radio-wrapper-checked {
  background: #3399ff !important;
  color: #fff !important;
}
</style>
<style lang="less" scoped>
.page {
  min-width: 680px;
}
.home-tab {
  margin-top: 20px;
}
.count-style{
  font-size: 50px;
}
.flex {
  display: flex;
}
.flex1 {
  flex: 1;
}
.wrap {
  flex-wrap: wrap;
}
.header {
  display: flex;
  padding: 10px 0;
}
.links {
  display: flex;
  flex-wrap: wrap;
  .item {
    color: #666;
    padding: 13px 0;
    width: 50%;
    text-align: center;
    &:hover {
      color: #2d8cf0;
      cursor: pointer;
    }
    .name {
      font-size: 12px;
      margin-top: 5px;
    }
  }
}
.nums {
  display: flex;
  justify-content: space-between;
  .column-center {
    min-width: 50px;
  }
  .title {
    font-size: 12px;
  }
  .value {
    font-size: 20px;
    color: #2d8cf0;
  }
}
.column-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}
.ava-wrapper {
  width: 130px;
  &:extend(.column-center);
}
.ava {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}
.area {
  color: #3399ff;
  margin-left: 2px;
  margin-top: 5px;
  padding-bottom: 10px;
  // border-bottom: 1px solid #dcdee2;
  // margin-bottom: 13px;
  font-size: 13px;
}
.card {
  margin-right: 25px;
  font-size: 0;
  &:last-child {
    margin-right: 0;
  }
  &.add {
    background: #f7f7f7;
    cursor: pointer;
  }
  .card-img {
    width: 100%;
    height: 10vw;
    object-fit: cover;
  }
  .main {
    border-left: 1px solid #dcdee2;
    border-bottom: 1px solid #dcdee2;
    border-right: 1px solid #dcdee2;
    font-size: 13px;
    padding: 0 10px;
    .name {
      color: #2d8cf0;
      font-size: 17px;
      padding-top: 10px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .desc {
      height: 57px;
      margin-top: 5px;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .bottom {
      display: flex;
      align-items: center;
      border-top: 1px solid #dcdee2;
      margin-top: 15px;
      padding: 15px 0;
      .title {
        font-size: 12px;
      }
      .value {
        color: #2d8cf0;
      }
    }
  }
}
.mes {
  border: 1px solid #dcdee2;
  // margin-bottom: 20px;
  padding: 15px 15px 0 15px;
  font-size: 13px;
  &.add {
    background: #f7f7f7;
    cursor: pointer;
    border: none;
    height: 147px;
  }
  .mes-top {
    display: flex;
    align-items: center;
    .ava {
      width: 70px;
      height: 70px;
      margin-right: 12px;
      margin-bottom: 0;
    }
    .name {
      color: #2d8cf0;
      font-size: 16px;
    }
    .desc {
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      height: 38px;
    }
  }
  .bottom {
    display: flex;
    align-items: center;
    border-top: 1px solid #dcdee2;
    margin-top: 15px;
    padding: 10px 0;
    .title {
      font-size: 12px;
    }
    .value {
      color: #2d8cf0;
    }
  }
}
</style>
