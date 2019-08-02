<template>
<div class="main">
  <div class="topp">
    <span class="topp-back" @click="$router.push('/main')"></span>
    <div class="topp-title">会议室预约</div>
    <span class="mine"></span>
  </div>
  <div class="block">
    <el-date-picker v-model="value1" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" :clearable="false" value-format="yyyy-MM-dd" @focus="dateFocus()" @change="dateFocus()">
    </el-date-picker>
  </div>
  <div class="toggle">
    <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
      <el-tab-pane label="东湖" name="first">
        <div class="meeting-item" v-for="item in dongHuList" :dataId="item.id" @click="openTime(item.books,item.name,item.devices,item.pnumber)">
          <div class="meeting-room">
            <div class="meeting-left">
              <h1 class="meeting-title">{{item.name}}</h1>
              <p class="meeting-cr p1">{{item.devices}}</p>
              <p class="meeting-cr p2">{{item.pnumber}}人</p>
              <p class="meeting-cr p3">{{item.address}}</p>
            </div>
            <div class="meeting-right"><img :src="item.thumbnail[0]"></div>
          </div>
          <div class="meeting-progress">
            <div class="progress-bar">
              <span v-for="span in item.books" :class="{gray:span==1?true:false}"></span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="西海" name="second">
        <div class="meeting-item" v-for="item in xiHaiList">
          <div class="meeting-room">
            <div class="meeting-left">
              <h1 class="meeting-title">{{item.name}}</h1>
              <p class="meeting-cr p1">{{item.devices}}</p>
              <p class="meeting-cr p2">{{item.pnumber}}人</p>
              <p class="meeting-cr p3">{{item.address}}</p>
            </div>
            <div class="meeting-right"><img :src="item.thumbnail[0]"></div>
          </div>
          <div class="meeting-progress">
            <div class="progress-bar">
              <span v-for="span in item.books" :class="{gray:span==1?true:false}"></span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div class="timePanel" v-if="show">
    <div class="timeHead">
      <p>{{name}}</p>
      <p>{{devices}}</p>
      <p>最多容纳{{pnumber}}人</p>
      <p><input type="text" placeholder="请输入会议主题..." /></p>
    </div>
    <div class="timeBox">
      <div class="timeItem" v-for="(item,index) in timeList" :id="'t'+(index+1)">
        <el-checkbox v-model="item.checked" :disabled="item.chose!='0'?true:false" @change="item.checked && chose(index);!item.checked && quitChose(index)">
          <p>
            {{selectableRange[index]}}
            <i v-if="item.outTime">已过期</i>
            <i v-if="!item.outTime && item.chose!=0">已被{{item.chose}}预定</i>
          </p>
        </el-checkbox>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="submitBox">
      <input type="button" name="" value="立即预定">
    </div>
  </div>
  <div class="datePickerBg" v-if="bgShow" @click="bgShow=!bgShow" @touchmove.prevent.stop></div>
</div>
</template>

<script>
import $ from 'jquery'
export default {
  data() {
    return {
      name: "",
      devices: "",
      pnumber: "",
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
      ]
    }
  },
  created() {
    this.currentDate()
    this.getList()
  },
  methods: {
    dateFocus() {
      this.bgShow = !this.bgShow
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
            this.timeList[dot].checked = true;
          }
        })
      }
    },
    quitChose(index) {
      let that = this
      if (index == this.startIndex) {
        this.startIndex += 1
      } else if (index == this.endIndex) {
        this.endIndex -= 1
      }
      let step = Math.ceil((this.endIndex - this.startIndex) / 2)
      console.log(step)
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
    openTime(books, name, devices, pnumber) {
      let that = this
      this.show = !this.show
      this.name = name
      this.devices = devices
      this.pnumber = pnumber
      let currentTime = new Date().getTime()
      books.forEach(function(item, index) {
        let iTime = that.value1 + " " + that.selectableRange[index].split('-')[1] + ":00"
        let outTime = ""
        iTime = new Date(iTime).getTime()
        if (iTime < currentTime) {
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
      this.axios.post("/api/api/meeting", {
        date: this.value1,
        token: "29d216fab87b6eb6f0fe8fe18658b00f"
      }).then(data => {
        data.data.data.data.forEach((item, index) => {
          if (item.region == 1) {
            this.dongHuList.push(item)
          } else {
            this.xiHaiList.push(item)
          }
        })
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
    }
  }
}
</script>
<style scoped>
.main {
  padding-top: 46px;
  background: #f2f2f2;
}

.block {
  padding: 15px;
  background: #fff;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}

.meeting-item {
  margin-bottom: 10px;
  overflow: hidden;
  background: #fff;
  padding: 10px;
}

.txt-center {
  text-align: center;
}

.my-order {
  width: 1.5rem !important;
}

.meeting-left {
  flex: 1;
  height: 60px;
}

.meeting-right {
  width: 80px;
  height: 60px;
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
  font-size: 15px;
  margin-bottom: 10px;
  color: #333;
}

.meeting-cr {
  color: #a1a1a1;
  font-size: 12px;
  margin-bottom: 10px;
}

.meeting-cr:last-child {
  margin: 0;
}

.progress-bar {
  height: 13px;
  margin: 10px 0 5px;
  border: 1px solid #ccc;
  overflow: hidden;
}

.progress-bar span {
  float: left;
  width: 3.125%;
  height: 10px;
}

.progress-count {
  display: flex;
  width: 104%;
  margin-left: -1%;
}

.progress-count span {
  flex: 1;
  font-size: 12px;
  color: #ef8201;
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
  background: rgb(170, 170, 170);
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
</style>
