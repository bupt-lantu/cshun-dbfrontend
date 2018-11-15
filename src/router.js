import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/Login.vue'
import Select from '@/pages/select/Select.vue'
import Edit from '@/pages/edit/Edit.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    
    {
      path: '/login',
      name: 'login',
      component: Login
    },

    {
      path: '/',
      name: 'select',
      component: Select,
      meta:{
        auth:true
      }
    },

    {
      path: '/edit/:id',
      name: 'edit',
      component: Edit,
      meta:{
        auth:true
      }
    }
  ]
})
