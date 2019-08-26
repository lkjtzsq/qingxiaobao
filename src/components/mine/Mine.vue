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
      if(!this.timer){
        this.timer=setTimeout(function(){
          that.$confirm('此操作将' + cancelTxt + '预约, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then((res) => {
            if(res=="confirm"){
              that.axios.post("/api/api/meeting/cancel_book",{
                id:id,
                "token":"29d216fab87b6eb6f0fe8fe18658b00f"
              }).then(data=>{
                console.log(data)
                if(data.data.msg=="请求成功"){
                  Toast(cancelTxt+"成功")
                  that.getList()
                }
              })
            }
          }).catch(() => {});
        },200)
      }else{
        clearTimeout(this.timer)
        this.timer=null
      }
    },
    getList() {
      this.axios.post("/api/api/meeting/my_book", {
        token: "29d216fab87b6eb6f0fe8fe18658b00f"
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
}
</style>
