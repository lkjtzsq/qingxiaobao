import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home.vue'
import Main from '@/components/main/Main.vue'
import Meeting from '@/components/meeting/Meeting.vue'
import New from '@/components/meeting/New.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/main',
      name: 'Main',
      component: Main
    },
    {
      path: '/meeting',
      name: 'Meeting',
      component: Meeting
    },
    {
      path: '/new',
      name: 'New',
      component: New
    }
  ]
})
