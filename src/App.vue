<template>
<div id="app">
  <keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
  </keep-alive>
  <router-view v-if="!$route.meta.keepAlive"></router-view>
</div>
</template>
<script>
import $ from "jquery"
export default {
  name: 'App'
}
</script>

<style>
</style>
