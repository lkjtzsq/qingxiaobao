<template>
<div class="container">
  <div class="topp">
    <span class="topp-back" @click="$router.go(-1)"></span>
    <div class="topp-title">我的预约</div>
  </div>
  <div class="main">
    <div class="slideNav">
      <mt-navbar v-model="selected">
        <mt-tab-item id="1">会议室</mt-tab-item>
        <mt-tab-item id="2">演播室</mt-tab-item>
        <mt-tab-item id="3">公共剪辑电脑</mt-tab-item>
        <mt-tab-item id="4">拍摄设备</mt-tab-item>
      </mt-navbar>
    </div>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <div class="wrapper" ref="wrapper">
          <div class="item-contain" :style="{height:height+'px'}">
            <div class="myItem">
              <h1 class="title">第一会议室（21-02）</h1>
              <p class="status">状态：已预订</p>
              <p class="theme">主题：会议</p>
              <p class="time">时间：2018-03-25 20:00-21:30</p>
              <p class="address">地点：中青大厦21层</p>
              <div style="height:5px;"></div>
              <div class="cancel-box">
                <span class="cancel">取 消</span>
              </div>
            </div>
            <div class="myItem">
              <h1 class="title">第一会议室（21-02）</h1>
              <p class="status">状态：已预订</p>
              <p class="theme">主题：会议</p>
              <p class="time">时间：2018-03-25 20:00-21:30</p>
              <p class="address">地点：中青大厦21层</p>
              <div style="height:5px;"></div>
              <div class="cancel-box">
                <span class="cancel">取 消</span>
              </div>
            </div>
            <div class="myItem">
              <h1 class="title">第一会议室（21-02）</h1>
              <p class="status">状态：已预订</p>
              <p class="theme">主题：会议</p>
              <p class="time">时间：2018-03-25 20:00-21:30</p>
              <p class="address">地点：中青大厦21层</p>
              <div style="height:5px;"></div>
              <div class="cancel-box">
                <span class="cancel">取 消</span>
              </div>
            </div>

          </div>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</div>
</template>

<script>
import BScroll from '@better-scroll/core'
export default {
  name: "Mine",
  data() {
    return {
      selected: "1",
      height: "",
      margin:10,
      itemH:208
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {

      this.height=(this.itemH+this.margin)*3
      let picScroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        click: true,
        bounce: false
      })
    }
  }
}
</script>

<style scoped>
.main {
  padding-top: 100px;
}

>>>.mint-tab-item {
  flex: auto;
}
>>> .mint-tab-item-label{
  font-size: 14px;
}
.container {
  height: 100%;
  width: 100%;
  background: #f2f2f2;
  position: absolute;
}

.slideNav {
  position: fixed;
  top: 46px;
  z-index: 999;
  width: 100%;
  height: 51px;
  background: #fff;
}

>>>.mint-tab-container,
>>>.mint-tab-container-wrap,
>>>.mint-tab-container-item,
.wrapper {
  height: -webkit-fill-available;
}

.wrapper {
  overflow: hidden;
}

.myItem {
  margin-bottom: 10px;
  background: #fff;
  padding: 15px 0 0;
  border-top: .5px solid #dfdfdf;
}

.title {
  font-size: 16px;
  margin-bottom: 13px;
  color: #333;
  font-weight: bold;
  padding: 0 15px;
}

.myItem p {
  color: #a1a1a1;
  font-size: 14px;
  margin-bottom: 13px;
  padding: 0 15px;
}

.cancel-box {
  border-top: .5px solid #dfdfdf;
  line-height: 50px;
  height: 50px;
  text-align: center;
}

.cancel {
  color: #26a2ff;
  font-size: 14px;
}
</style>
