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
        <div class="no-list" v-if="noList">暂无预约</div>
        <div class="loading-box" v-if="loadingShow">
          <svg viewBox="25 25 50 50" class="loading">
            <circle cx="50" cy="50" r="20" fill="none" class="loading-path"></circle>
          </svg>
        </div>
        <div class="wrapper" ref="wrapper">
          <div class="item-contain" :style="{height:height+'px'}">
            <div class="myItem" v-for="(item,index) in list" :key="index">
              <h1 class="title">{{item.name}}</h1>
              <p class="status">状态：{{item.status}}</p>
              <p class="theme">主题：{{item.theme}}</p>
              <p class="time">时间：{{item.date}} {{item.start_time}}至{{item.end_time}}</p>
              <p class="address">地点：{{item.address}}</p>
              <div style="height:5px;"></div>
              <div class="cancel-box">
                <span class="cancel" @click="deleteApply(item.id,item.cancelTxt)">{{item.cancelTxt}}</span>
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
import {
  Toast,
  MessageBox
} from 'mint-ui'
import BScroll from '@better-scroll/core'
export default {
  name: "Mine",
  data() {
    return {
      noList:false,
      loadingShow:true,
      selected: "1",
      height: "",
      margin: 10,
      itemH: 208,
      list: [],
      timer:null
    }
  },
  created() {
    this.getList()
  },
  watch: {
    list(val) {
      this.$nextTick(() => {
        this.init();
      });
    }
  },
  methods: {
    deleteApply(id, cancelTxt) {
      let that=this
      if(this.timer!=null){
        clearTimeout(this.timer)
      }
      this.timer=setTimeout(function(){
        that.$confirm('此操作将' + cancelTxt + '预约, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then((res) => {
          if(res=="confirm"){
            console.log(1)
            that.axios.post(that.$store.state.domain+"api/meeting/cancel_book",{
              id:id,
              "token":localStorage.getItem("token")
            }).then(data=>{
              console.log(data)
              if(data.data.msg=="请求成功"){
                Toast(cancelTxt+"成功")
                that.getList()
              }
            })
          }
        }).catch(() => {});
      },10)
    },
    getList() {
      this.axios.post(this.$store.state.domain+"api/meeting/my_book", {
        token: localStorage.getItem("token")
      }).then(data => {
        this.list = data.data.data.data
        this.list.forEach((item, index) => {
          let endTime = new Date(item.date.replace(/-/g, "/") + " " + item.end_time).getTime()
          let currentTime = new Date().getTime()
          if (endTime < currentTime) {
            this.list[index].status = "已过期";
            this.list[index].cancelTxt = "删除";
          } else {
            switch (this.list[index].status) {
              case "-1":
                this.list[index].status = "已结束";
                break;
              case "0":
                this.list[index].status = "审核中";
                break;
              case "1":
                this.list[index].status = "已预订";
                break;
              case "2":
                this.list[index].status = "未通过";
                break;
              case "3":
                this.list[index].status = "已撤销";
                break;
            }
            this.list[index].cancelTxt = "取消";
          }
        })
        this.loadingShow=false
        if(!this.list.length){
          this.noList=true
        }
      })
    },
    init() {
      this.height = (this.itemH + this.margin) * this.list.length
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

>>>.mint-tab-item-label {
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
  letter-spacing: 5px;
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
.no-list{
  text-align: center;
padding-top: 50px;
color: #999;
font-size: 14px;
}
</style>
