this.$store.state.domain<template>
<div class="" style="overflow:hidden;">
  <div class="hello">
    <img class="logo" :src="logo">
    <img class="logoTxt" :src="logoTxt" />
  </div>
</div>
</template>
<script>
export default {
  name: 'Home',
  data() {
    return {
      logo: require("@/assets/images/logo.png"), // 首页logo
      logoTxt: require("@/assets/images/logo-txt.png"), // 首页文字
      seconds: 3
    }
  },
  created() {
    this.toLogin();
    this.getToken()
  },
  methods: {
    getToken() {
      let that=this
      let wx_id = this.$route.query.wx_open_id
      console.log(wx_id)
      if (wx_id) {
        this.axios.post(this.$store.state.domain+"api/get_token", {
          wx_open_id: wx_id
        }).then(data => {
          console.log(data)
          if (data.data.data.token) {
            localStorage.setItem("name",data.data.data.name)
            localStorage.setItem("token",data.data.data.token)
          } else {
            clearTimeout(this.timer)
            setTimeout(function(){
              that.$router.push({
                path: '/login',
                query: {
                  wx_open_id: that.$route.query.wx_open_id
                }
              })
            },this.seconds*1000)
          }
        })
      }
    },
    // 定时跳转
    toLogin() {
      let _this = this
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.seconds--
          if (this.seconds == 0) {
            clearInterval(this.timer)
            setTimeout(() => {
              _this.$router.push({
                path: '/main',
                query: {
                  wx_open_id: this.$route.query.wx_open_id
                }
              })
            }, 1000)
          }
      }, 1000)
    }
  }
}
</script>
<style scoped>
.logo {
  width: 40%;
  display: block;
  margin: 33% auto 20%;
  max-width: 121px;
}

.logoTxt {
  display: block;
  margin: 0 auto;
  width: 55.7%;
}
</style>
