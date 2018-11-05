import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/Home.vue'
import Login from '@/pages/login/Login.vue'
import Select from '@/pages/select/Select.vue'
import Edit from '@/pages/edit/Edit.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/select',
      name: 'select',
      component: Select
    },
    {
      path: '/edit',
      name: 'edit',
      component: Edit
    }
  ]
})
