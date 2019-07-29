<template>
<div class="main">
  <div class="topp">
    <span class="topp-back" @click="$router.push('/main')"></span>
    <div class="topp-title">会议室预约</div>
    <span class="mine"></span>
  </div>
  <div class="block">
    <el-date-picker v-model="value1" type="date" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" :clearable="false">
    </el-date-picker>
  </div>
  <div class="block">
    <el-time-picker :is-range="true" v-model="value3" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" value-format="hh:mm:ss" :picker-options="pickerChose">
    </el-time-picker>
  </div>
  <div class="toggle">
    <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
      <el-tab-pane label="东湖" name="first">
        <div class="meeting-item" v-for="item in dongHuList" :dataId="item.id">
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
        <div class="meeting-item" v-for="item in xiHaiList" :dataId="item.id">
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
</div>
</template>

<script>
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      pickerChose:{
        format:"hh-mm"
      },
      value1: '',
      activeName: 'first',
      dongHuList: [],
      xiHaiList: [],
      value3: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      value4: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]
    }
  },
  created() {
    this.currentDate()
    this.getList()
  },
  methods: {
    getList() {
      this.axios.post("/api/api/meeting", {
        date: this.value1,
        token: "29d216fab87b6eb6f0fe8fe18658b00f"
      }).then(data => {
        console.log(data.data.data.data)
        data.data.data.data.forEach((item, index) => {
          console.log(item)
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
}

.block {
  margin: 15px;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}

.meeting-item {
  margin: 0 10px 20px 10px;
  overflow: hidden;
  background: #f7f7f7;
  padding: 10px;
  box-shadow: 0px 3px 10px 0px #ccc;
}

.txt-center {
  text-align: center;
}

.my-order {
  width: 1.5rem !important;
}

.meeting-left {
  flex: 1;
}

.meeting-right {
  width: 135px;
  height: 107px;
  float: right;
}

.meeting-right img {
  width: 100%;
  height: 100%;
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
  margin-bottom: 8px;
  color: #57b83e;
}

.meeting-cr {
  color: #a1a1a1;
  font-size: 12px;
}

.progress-bar {
  height: 10px;
  margin: 10px 0 5px;
  width: 99%;
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
</style>
