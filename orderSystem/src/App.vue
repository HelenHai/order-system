<template>
  <div id="app">
    <left-nav></left-nav>
    <div class="main">
      <router-link to='/goods'></router-link>
      <router-view></router-view> 
    </div>
  </div>
</template>

<script>
import LeftNav from '@/components/common/leftNav'
export default {
  name: 'app',
  components:{
    LeftNav
  }
}
</script>

<style>
@import './assets/css/common.css';
#app{
  height: 100%; width:100%;
}
.main{
  height: 100%;
  float: left; width:95%; 
  overflow: scroll;  
}
</style>
