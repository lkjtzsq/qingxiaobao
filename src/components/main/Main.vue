<template>
<div class="main">
  <div class="logo">
    <img src="../../assets/images/logo.png" />
  </div>
  <div class="logo-txt">
    <img src="../../assets/images/main-txt.png" />
  </div>
  <p class="welcome">欢迎{{name}}</p>
  <div class="main-box">
    <div class="main-item">
      <router-link :to="'/meeting?wx_open_id='+$route.query.wx_open_id">
        <img src="../../assets/images/meeting.png" />
        <p>会议室预约</p>
      </router-link>
    </div>
    <div class="main-item">
      <img src="../../assets/images/studio.png" />
      <p>演播室预约</p>
    </div>
    <div class="main-item">
      <img src="../../assets/images/computer.png" />
      <p>公共剪辑电脑预约</p>
    </div>
    <div class="main-item">
      <img src="../../assets/images/camera.png" />
      <p>拍摄设备预约</p>
    </div>
    <div class="main-item">
      <img src="../../assets/images/parking.png" />
      <p>车位预约</p>
    </div>
    <div class="main-item">
      <router-link to="/mine">
        <img src="../../assets/images/mine.png" />
        <p>我的预约</p>
      </router-link>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      name: ""
    }
  },
  created() {
    if (localStorage.getItem("name")) {
      this.name = localStorage.getItem("name")
    } else {
      this.getToken()
    }
  },
  methods: {
    getToken() {
      let wx_id = this.$route.query.wx_open_id
      this.axios.post(this.$store.state.domain + "api/get_token", {
        wx_open_id: wx_id
      }).then(data => {
        console.log(data)
        if (data.data.data.token) {
          this.name = data.data.data.name
          localStorage.setItem("name", data.data.data.name)
          localStorage.setItem("token", data.data.data.token)
        } else {
          this.$router.push(`/login`)
        }
      })
    }

  }
}
</script>

<style scoped>
.main {
  text-align: center;
}

.logo img {
  width: 40%;
  display: block;
  margin: 7% auto 6%;
  max-width: 121px;
}

.logo-txt img {
  width: 60%;
  display: block;
  margin: 0 auto 6%;
  max-width: 476px;
}

.welcome {
  font-size: 16px;
  color: #d3a705;
  letter-spacing: 2px;
  font-family: simhei;
}

.main-box {
  overflow: hidden;
  padding: 5% 0 14%;
}

.main-item {
  float: left;
  width: 50%;
  text-align: center;
  padding: 4% 0;
}

.main-item a {
  display: block;
}

.main-item img {
  height: 63px;
}

.main-item p {
  color: #d3a705;
  font-weight: bold;
  padding-top: 5px;
}
</style>
