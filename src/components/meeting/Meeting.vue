<template>
<div class="main">
  <div class="topp">
    <span class="topp-back" @click="$router.go(-1)"></span>
    <div class="topp-title">会议室预约</div>
    <router-link to="/mine"><span class="mine"></span></router-link>
  </div>
  <div class="block">
    <el-date-picker v-model="value1" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" :clearable="false" value-format="yyyy-MM-dd" @focus="dateFocus()" @change="dateChange()" :validate-event="false" @touchmove.stop>
    </el-date-picker>
  </div>
  <div class="toggle">
    <div class="loading-box" v-if="loadingShow">
      <svg viewBox="25 25 50 50" class="loading">
        <circle cx="50" cy="50" r="20" fill="none" class="loading-path"></circle>
      </svg>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
      <el-tab-pane label="东湖" name="first">
        <div class="meeting-item" v-for="item in dongHuList" :dataId="item.id" @click="openTime(item.books,item.name,item.devices,item.pnumber,item.address,item.id)">
          <div class="meeting-room">
            <div class="meeting-left">
              <h1 class="meeting-title">{{item.name}}</h1>
              <p class="meeting-cr p1">{{item.devices}}</p>
              <p class="meeting-cr p2"><span class="pnumber">{{item.pnumber}}</span>人<span class="address">{{item.address}}</span></p>
            </div>
            <div class="meeting-right"><img :src="item.thumbnail[0]" @click.stop="slideImageShow=!slideImageShow;slideImage=item.thumbnail[0]"></div>
          </div>
          <div class="meeting-progress">
            <div class="progress-bar">
              <span v-for="span in item.books" :class="gray(span)"></span>
            </div>
            <div class="progress-count">
              <span v-for="item in progressCount">{{item}}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="西海" name="second">
        <div class="meeting-item" v-for="item in xiHaiList" :dataId="item.id" @click="openTime(item.books,item.name,item.devices,item.pnumber,item.address,item.id)">
          <div class="meeting-room">
            <div class="meeting-left">
              <h1 class="meeting-title">{{item.name}}</h1>
              <p class="meeting-cr p1">{{item.devices}}</p>
              <p class="meeting-cr p2"><span class="pnumber">{{item.pnumber}}</span>人<span class="address">{{item.address}}</span></p>
            </div>
            <div class="meeting-right"><img :src="item.thumbnail[0]" @click.stop="slideImageShow=!slideImageShow;slideImage=item.thumbnail[0]"></div>
          </div>
          <div class="meeting-progress">
            <div class="progress-bar">
              <span v-for="span in item.books" :class="gray(span)"></span>
            </div>
            <div class="progress-count">
              <span v-for="item in progressCount">{{item}}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <transition enter-active-class="animated slideInUp">
    <div class="timePanel" v-if="show">
      <div class="timeHead">
        <i class="close" @click="show=!show"></i>
        <h1 class="panel-title">{{name}}</h1>
        <p class="panel-p">{{devices}}</p>
        <p class="panel-p"><span class="pnumber">{{pnumber}}</span>人<span class="address">{{address}}</span></p>
        <p class="panel-input">
          <el-input v-model="theme" placeholder="请输入会议主题" resize="none"></el-input>
        </p>
      </div>
      <div class="timeBox" ref="picWrapper">
        <ul class="tbList" ref="picList">
          <li class="timeItem" v-for="(item,index) in timeList" :id="'t'+(index+1)">
            <el-checkbox v-model="item.checked" :disabled="item.chose!='0'?true:false" @change="item.checked && chose(index);!item.checked && quitChose(index)">
              <p>
                {{selectableRange[index]}}
                <i v-if="item.outTime">已过期</i>
                <i v-if="!item.outTime && item.chose!=0">已被{{item.chose}}预定</i>
              </p>
            </el-checkbox>
            <span></span>
            <span></span>
          </li>
        </ul>
      </div>
      <div class="submitBox">
        <el-button type="primary" :disabled="disable" @click="submitMeeting()">立即预定</el-button>
      </div>
    </div>
  </transition>
  <div class="datePickerBg" v-if="bgShow" @click="bgShow=!bgShow" @touchmove.prevent.stop></div>
  <transition enter-active-class="animated fadeIn">
    <div class="slideImage" v-if="slideImageShow" @click="slideImageShow=!slideImageShow">
      <img :src="slideImage" />
    </div>
  </transition>
</div>
</template>

<script>
import $ from 'jquery'
import {
  Toast,
  MessageBox
} from 'mint-ui'
import BScroll from '@better-scroll/core'
export default {
  data() {
    return {
      theme: "会议",
      mid: null,
      btnDisabled: true,
      loadingShow: true,
      slideImage: "",
      slideImageShow: false,
      name: "",
      devices: "",
      pnumber: "",
      address: "",
      startIndex: null,
      endIndex: null,
      bgShow: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      show: false,
      value1: '',
      hasChosed: false,
      activeName: 'first',
      dongHuList: [],
      xiHaiList: [],
      timeList: [],
      checked: false,
      selectableRange: [
        "07:00-07:30",
        "07:30-08:00",
        "08:00-08:30",
        "08:30-09:00",
        "09:00-09:30",
        "09:30-10:00",
        "10:00-10:30",
        "10:30-11:00",
        "11:00-11:30",
        "11:30-12:00",
        "12:00-12:30",
        "12:30-13:00",
        "13:00-13:30",
        "13:30-14:00",
        "14:00-14:30",
        "14:30-15:00",
        "15:00-15:30",
        "15:30-16:00",
        "16:00-16:30",
        "16:30-17:00",
        "17:00-17:30",
        "17:30-18:00",
        "18:00-18:30",
        "18:30-19:00",
        "19:00-19:30",
        "19:30-20:00",
        "20:00-20:30",
        "20:30-21:00",
        "21:00-21:30",
        "21:30-22:00",
        "22:00-22:30",
        "22:30-23:00"
      ],
      progressCount: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    }
  },
  created() {
    this.currentDate()
    this.getList()
    this.getToken()
  },
  watch: {
    checked(val) {
      if (val == true) {
        console.log(val)
        this.timeList.forEach((item, index) => {
          if (item.chose == "0") {
            this.timeList[index].checked = false
          }
        })
        this.checked = false
      }
    },
    timeList(val) {
      this.$nextTick(() => {
        this._initPics();
      });
      console.log(val)
    },
    bgShow(val) {
      if (val == true) {
        $('body').css({
          height: "100%",
          "overflow-y": "hidden",
          position: "absolute"
        })
      } else {
        $('body').css({
          height: "auto",
          "overflow-y": "auto",
          position: "initial"
        })
      }
    },
    show(val) {
      if (val == true) {
        $('body').css({
          height: "100%",
          "overflow-y": "hidden",
          position: "absolute"
        })
      } else {
        $('body').css({
          height: "auto",
          "overflow-y": "auto",
          position: "initial"
        })
      }
    }
  },
  computed: {
    gray(span) {
      return function(span) {
        if (span != "0") {
          return "gray"
        }
      }
    },
    disable() {
      if (this.startIndex && this.endIndex && this.theme) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    getToken() {
      if (!localStorage.getItem("token")) {
        this.$router.push(`/login?wx_open_id=${this.$route.query.wx_open_id}`)
      }
    },
    submitMeeting() {
      this.axios.post(this.$store.state.domain + "api/meeting/meeting_book", {
        token: localStorage.getItem("token"),
        mid: this.mid,
        date: this.value1,
        start_p: this.startIndex + 1,
        end_p: this.endIndex + 1,
        theme: this.theme
      }).then(data => {
        if (data.data.msg == "请求成功") {
          MessageBox.confirm('', {
            title: "提示",
            message: "预定成功!",
            showCancelButton: false,
            closeOnClickModal: false
          }).then(action => {
            if (action == "confirm") {
              this.$router.push('/mine')
            }
          });
        } else {
          Toast({
            message: data.data.msg,
            iconClass: 'mint-toast-icon mintui mintui-error'
          })
        }
      })
    },
    dateFocus() {
      this.bgShow = !this.bgShow
    },
    dateChange() {
      this.bgShow = !this.bgShow
      this.dongHuList = []
      this.xiHaiList = []
      this.getList()
    },
    chose(index) {
      let that = this
      if (this.startIndex == null) {
        this.startIndex = index
        this.endIndex = index
      } else {
        if (index < this.startIndex) {
          this.startIndex = index
        } else if (index > this.endIndex) {
          this.endIndex = index
        }
        this.timeList.some((item, dot) => {
          if (dot > that.startIndex && dot < that.endIndex) {
            if (item.chose != "0") {
              that.checked = true
              that.startIndex = null
              that.endIndex = null
              return true
            }
            this.timeList[dot].checked = true;
          }
        })
      }
    },
    quitChose(index) {
      let that = this
      if (index == this.startIndex) {
        if (this.startIndex == this.endIndex) {
          this.startIndex = null
          this.endIndex = null
        } else {
          this.startIndex += 1
        }
      } else if (index == this.endIndex) {
        this.endIndex -= 1
      }
      console.log(this.startIndex)
      console.log(this.endIndex)
      let step = Math.ceil((this.endIndex - this.startIndex) / 2)
      if (index < step + this.startIndex) {
        this.timeList.some((item, dot) => {
          if (dot >= that.startIndex && dot < index) {
            this.timeList[dot].checked = false;
          }
        })
        this.startIndex = index + 1
      } else {
        this.timeList.some((item, dot) => {
          if (dot > index && dot <= that.endIndex) {
            this.timeList[dot].checked = false;
          }
        })
        this.endIndex = index - 1
      }

    },
    outTime(index) {
      let currentTime = new Date().getTime()
      let iTime = this.value1.replace(/\-/g, '/') + " " + this.selectableRange[index].split('-')[1] + ":00"
      iTime = new Date(iTime).getTime()
      if (iTime < currentTime) {
        return true
      } else {
        return false
      }
    },
    openTime(books, name, devices, pnumber, address, id) {
      this.startIndex = null
      this.endIndex = null
      this.timeList = []
      let that = this
      this.mid = id
      this.show = !this.show
      this.name = name
      this.devices = devices
      this.pnumber = pnumber
      this.address = address
      books.forEach(function(item, index) {
        let outTime = ""
        if (that.outTime(index)) {
          outTime = true
          that.timeList.push({
            chose: "已过期",
            index: index,
            checked: true,
            outTime: outTime
          })
        } else {
          outTime = false
          if (item != "0") {
            that.timeList.push({
              chose: item,
              index: index,
              checked: true,
              outTime: outTime
            })
          } else {
            that.timeList.push({
              chose: item,
              index: index,
              checked: false,
              outTime: outTime
            })
          }
        }

      })
    },
    getList() {
      let that = this
      this.axios.post(this.$store.state.domain + "api/meeting", {
        date: this.value1,
        token: localStorage.getItem("token")
      }).then(data => {
        console.log(data)
        data.data.data.data.forEach((item, index) => {
          item.books.forEach(function(v, i) {
            if (that.outTime(i)) {
              data.data.data.data[index].books[i] = "1"
            }
          })
          if (item.region == 1) {
            this.dongHuList.push(item)
          } else {
            this.xiHaiList.push(item)
          }
        })
        this.loadingShow = !this.loadingShow
      })
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    currentDate() {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = date.getHours()
      let minute = date.getMinutes()
      month = this.toFix2(month)
      day = this.toFix2(day)
      hour = this.toFix2(hour)
      minute = this.toFix2(minute)
      this.value1 = `${year}-${month}-${day}`
    },
    toFix2(val) {
      let newVal = String(val).length > 1 ? val : ('0' + val)
      return newVal
    },
    _initPics() {
      let picScroll = new BScroll(this.$refs.picWrapper, {
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
  padding-top: 146px;
  background: #f2f2f2;
}

.block {
  padding: 15px;
  background: #fff;
  position: fixed;
  width: 100%;
  top: 46px;
  z-index: 999;
  box-sizing: border-box;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}

.meeting-item {
  margin-bottom: 10px;
  background: #fff;
  padding: 12px;
}

.timeBox {
  overflow: hidden;
  height: -webkit-fill-available;
}

.tbList li {
  position: relative;
  height: 50px;
  line-height: 50px;
  padding: 0px 15px;
  border-bottom: 1px solid #dcdfe6;
}

.txt-center {
  text-align: center;
}

.my-order {
  width: 1.5rem !important;
}

.meeting-left {
  flex: 1;
  height: 64px;
}

.meeting-right {
  width: 85px;
  height: 64px;
  float: right;
}

.meeting-right img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}


.time-box {
  text-align: center;
  margin: 10px 0;
}

.time-txt {
  font-size: 14px;
  color: #ef8201;
  vertical-align: middle;
}

.time-box input {
  width: 108px;
  height: 30px;
  border: none;
  background: #f7f7f7;
  text-align: center;
  font-size: 14px;
  color: #ef8201;
  vertical-align: middle;
}


.meeting-title {
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
}

.meeting-cr {
  color: #a1a1a1;
  font-size: 14px;
  margin-bottom: 10px;
}

.meeting-cr:last-child {
  margin: 0;
}

.progress-bar {
  height: 13px;
  margin: 15px 0 5px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
}

.progress-bar span {
  float: left;
  width: 3.125%;
  height: 100%;
}

.progress-count {
  display: flex;
  width: 104%;
  margin-left: -1%;
}

.progress-count span {
  flex: 1;
  font-size: 12px;
  color: #e5e5e5;
}

.view-pic-bg,
.view-pic {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: .5;
  display: none;
}

.view-pic {
  opacity: 1;
}

.view-pic img {
  width: 100%;
}

.time-chose-bg {
  background: #000;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: .5;
  display: none;
}

.time-content {
  overflow: scroll;
}

.ts-head {
  padding: 10px 10px 5px;
  border-bottom: 1px solid #ccc;
}

.time-chose {
  position: fixed;
  background: #fff;
  height: 80%;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  display: none;
}

.ts-group {
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  height: 48px;
  line-height: 48px;
  padding: 0 10px;
  position: relative;
}

.ts-group label {
  display: block;
}

.ts-group label.disabled {
  display: block;
  color: #a1a1a1;
  text-decoration: line-through;
}

.ts-group input {
  vertical-align: -1px;
}

.ts-group .ts-tag {
  position: absolute;
  right: 10px;
}

.ts-submit {
  padding: 10px;
  border-top: 1px solid #ccc;
}

.ts-btn {
  width: 100%;
  height: 40px;
  border: none;
  color: #fff;
  border-radius: 3px;
  background: #ccc;
}

.ts-btn.on {
  background: #00a7f5;
}

.header-span {
  background: #57b83e;
  width: 85px;
  height: 30px;
  display: inline-block;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  color: #fff;
  border-radius: 4px;
}

.back-white {
  background: #fff !important;
  height: 60px;
  line-height: 60px;
  padding: 0 20px
}

.txt-center {
  text-align: center;
}

.meeting-room {
  overflow: hidden;
  width: 100%;
  display: flex;
}

.ts-desc,
.ts-count {
  color: #a1a1a1;
}

.ts-head h1 {
  font-size: 16px;
  margin-bottom: 8px;
}

.meeting-contain {
  overflow: scroll;
}

.theme {
  border: 1px solid #ccc;
  border-radius: 3px;
  margin: 8px 0 5px;
}

#theme {
  width: 100%;
  height: 40px;
  padding: 0 5px;
  font-size: .3rem;
  border: none;
  border-radius: 44px;
}

.toggle-head {
  text-align: center;
  width: 100%;
}

.mine-box {
  padding-top: 10px;
}

>>>.el-tabs__item {
  font-size: 15px;
}

.gray {
  background: #e5e5e5;
}

>>>.el-time-range-picker {
  width: 100%;
}

.timePanel {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: #fff;
  width: 100%;
  height: 100%;
  padding-top: 65px;
  box-sizing: border-box;
  padding: 139px 0 61px;
  overflow: hidden;
}

.datePickerBg {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #000;
  opacity: .5;
  z-index: 1500;
}

>>>.el-tabs__header {
  background: #fff;
  margin: 0 0 10px;
}

.pnumber {
  padding-left: 15px;
  background: url(../../assets/images/people.png) 0 center no-repeat;
  background-size: auto 13px;
}

.address {
  padding-left: 15px;
  background: url(../../assets/images/position.png) 0 center no-repeat;
  background-size: auto 13px;
  margin-left: 5px;
}

.slideImage {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #000;
  top: 0;
  left: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
}

.slideImage img {
  width: 100%;
}

.timeHead {
  position: fixed;
  width: -webkit-fill-available;
  top: 0;
  z-index: 5000;
  background: #fff;
  padding: 15px;
  border-bottom: 1px solid #dcdfe6;
  height: 114px;
}

.close {
  position: absolute;
  right: 12px;
  top: 12px;
  width: 30px;
  height: 30px;
  background: url(../../assets/images/close.png);
  background-size: 100% 100%;
}

.submitBox {
  padding: 10px;
  border-top: 1px solid #ccc;
  position: fixed;
  bottom: 0;
  width: -webkit-fill-available;
  background: #fff;
}

.submitBox input {
  width: 100%;
}

.toggle {
  position: relative;
}

.loading-box {
  text-align: center;
  position: absolute;
  top: 195px;
  width: 100%;
}

.loading {
  height: 42px;
  width: 42px;
  animation: loading-rotate 2s linear infinite;
}

.loading-path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: #409eff;
  stroke-linecap: round;
}

.panel-title {
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
  height: 16px;
  font-weight: bold;
}

.panel-p {
  color: #a1a1a1;
  font-size: 14px;
  height: 14px;
  margin-bottom: 10px;
}

>>>.el-input__inner {
  line-height: 18px;
}

>>>.el-checkbox__inner {
  border-radius: 50px;
  width: 18px;
  height: 18px;
}

>>>.el-button {
  width: 100%;
}

>>>.el-checkbox__label {
  padding-left: 3px;
}

>>>.el-checkbox__label {
  font-size: 16px;
}

>>>.el-checkbox__label i {
  font-weight: normal;
  position: absolute;
  line-height: 50px;
  right: 15px;
  top: 0;
}

>>>.el-checkbox__inner::after {
  left: 5px;
  top: 1px;
  width: 5px;
  height: 9px;
}

>>>.el-checkbox,
.el-checkbox__input {
  position: initial;
}

>>>.el-checkbox {
  width: 100%;
}

>>>.panel-input .el-input__inner {
  padding: 0 10px;
}

>>>.el-tabs__header {
  top: 105px;
  position: fixed;
  width: 100%;
  z-index: 999;
  background: #fff;
}
</style>
