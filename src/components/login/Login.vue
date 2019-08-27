<template>
<div class="main">
  <div class="top">
    <img class="logo" src="../../assets/images/logo.png" />
    <img class="logo-txt" src="../../assets/images/logo-txt.png" />
  </div>
  <div class="input-group">
    <mt-field placeholder="请输入姓名" type="text" v-model="uname" @blur.native.capture="$store.commit('inputFocusOut')"></mt-field>
    <mt-field placeholder="请输入手机" type="tel" v-model="telephone" @blur.native.capture="$store.commit('inputFocusOut')"></mt-field>
    <mt-field v-model="captcha" type="tel" placeholder="请输入验证码" @blur.native.capture="$store.commit('inputFocusOut')"><span @click="getCode" class="codeBtn" :class="{red:!timer}">{{text}}</span>
    </mt-field>
    <select class="mselect" v-model="selected" @blur="$store.commit('inputFocusOut')">
      <option value="0">请选择公司</option>
      <option :value="index+1" v-for="(item,index) in companys">{{item}}</option>
    </select>
    <mt-field placeholder="备注" type="text" v-model="remarks" @blur.native.capture="$store.commit('inputFocusOut')"></mt-field>
  </div>
  <div class="submitBox" @click="submit()">登 录</div>
</div>
</template>

<script>
import { Toast } from 'mint-ui'
export default {
  name: "Login",
  data() {
    return {
      uname: "",
      telephone: "",
      captcha: "",
      remarks: "",
      timer: null,
      text: "获取验证码",
      companys: [],
      selected: "0"
    }
  },
  created() {
    this.getCompany()
  },
  methods: {
    submit() {
      if (this.uname == "") {
        this.$toast({
          message: '姓名不能为空',
          position: 'bottom',
          iconClass: '',
          duration: 2000
        });
      } else if (!/^1[0-9]{10}/.test(this.telephone)) {
        this.$toast({
          message: '手机号格式错误',
          position: 'bottom',
          iconClass: '',
          duration: 2000
        });
      } else if (this.captcha == "") {
        this.$toast({
          message: '验证码不能为空',
          position: 'bottom',
          iconClass: '',
          duration: 2000
        });
      } else if (this.selected == 0) {
        this.$toast({
          message: '请选择公司',
          position: 'bottom',
          iconClass: '',
          duration: 2000
        });
      } else {
        this.axios.post("/api/api/register", {
          name: this.uname,
          telephone: this.telephone,
          code: this.captcha,
          region: this.selected,
          duty: this.remarks,
          wx_open_id: this.$route.query.wx_open_id
        }).then(data => {
          console.log(data)
          if (data.data.data.token) {
            Toast({
              message: "登录成功",
              iconClass: 'mint-toast-icon mintui mintui-success',
            });
            this.$router.push({
              path:'/main',
              query:{
                wx_open_id:this.$route.query.wx_open_id
              }
            })
            localStorage.setItem("token", data.data.data.token)
          }else{
            this.$toast({
              message: data.data.msg,
              position: 'bottom',
              iconClass: '',
              duration: 2000
            });
          }
        })
      }
    },
    getCompany() {
      this.axios.get("/api/api/get_company").then(data => {
        console.log(data)
        for (var index in data.data.data) {
          this.companys.push(data.data.data[index])
        }
      })
    },
    getCode() {
      const telReg = /^1[0-9]{10}/g // 手机号匹配
      if (!telReg.test(this.telephone)) { // 手机号验证
        this.$toast({
          message: '手机号格式错误',
          position: 'bottom',
          iconClass: '',
          duration: 2000
        });
      } else {
        if (this.timer == null) {
          this.codeTimer()
        }
      }
    },
    codeTimer() {
      this.axios.post("/api/api/send_sms", {
        telephone: this.telephone
      }).then(data => {
        console.log(data)
        if (data.data.code == 400) {
          this.$toast({
            message: data.data.msg,
            position: 'bottom',
            iconClass: '',
            duration: 2000
          });
        } else if (data.data.code == 200) {
          console.log(data)
          let seconds = 60
          this.text = "60秒后重新获取"
          this.timer = setInterval(() => {
            seconds--
            this.text = seconds + "秒后重新获取"
            if (seconds == 0) {
              clearInterval(this.timer)
              this.timer = null
              this.text = "点击重新获取"
            }
          }, 1000)
        }
      })
    }
  }
}
</script>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
}

.logo {
  width: 40%;
  display: block;
  margin: 15% auto 5%;
  max-width: 121px;
}

.logo-txt {
  display: block;
  margin: 0 auto 10%;
  width: 55%;
  max-width: 191px;
}

.input-group {
  margin: 0 25px;
}

>>>input::-webkit-input-placeholder {
  color: #ccc
}

>>>.mint-cell-wrapper {
  background: none;
}

>>>.mint-cell-wrapper {
  padding: 0;
}

>>>.mint-field-core {
  font-size: 14px;
  color: #333;
}

>>>.mint-cell {
  background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: bottom;
}

.codeBtn {
  color: #bdbdbd;
  margin-left: 20px;
  font-size: 14px;
}

.red {
  color: #ef8201;
}

.mselect {
  width: 100%;
  height: 48px;
  -webkit-appearance: none;
  border: none;
  border-bottom: 1px solid #d9d9d9;
  color: #333;
  border-radius: 0;
  font-size: 14px;
}

.submitBox {
  height: 45px;
  line-height: 45px;
  text-align: center;
  background: #ef8201;
  color: #fff;
  border-radius: 3px;
  margin: 35px 25px;
}
</style>
