import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// Vue.use(axios)
const store = new Vuex.Store({
  state:{
  },
  mutations:{
    inputFocusOut(state){
      if(state.timer){
        clearTimeout(state.timer)
      }
      state.timer=setTimeout(()=>{
        window.scrollTo(0,0)
      })
    }
  }
})
export default store
