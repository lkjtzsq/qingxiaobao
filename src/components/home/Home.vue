<template>
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
  },
  methods: {
    // 定时跳转
    toMain() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.$router.push('/main')
    },
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
              _this.$router.push('/main')
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
