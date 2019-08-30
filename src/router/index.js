import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home.vue'
import Main from '@/components/main/Main.vue'
import Meeting from '@/components/meeting/Meeting.vue'
import Mine from '@/components/mine/Mine.vue'
import Login from '@/components/login/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/meeting',
      name: 'Meeting',
      component: Meeting
    },
    {
      path: '/mine',
      name: 'Mine',
      component: Mine
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta:{
        keepAlive:true
      }
    }
  ]
})
