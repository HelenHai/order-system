import Vue from 'vue'
import Router from 'vue-router'
import Goods from '@/components/views/goods'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      component:Goods
    }
  ]
})
