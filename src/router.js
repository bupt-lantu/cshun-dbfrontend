import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/Login.vue'
import Select from '@/pages/select/Select.vue'
import Edit from '@/pages/edit/Edit.vue'
import ExportImg from '@/pages/edit/components/ExportImg.vue'
import ImprotImg from '@/pages/edit/components/ImportImg.vue'
import NotFound from '@/pages/errors/NotFound.vue'
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
    },
    {
      path: '/importImg',
      name: 'importImg',
      component: ImprotImg,
      meta:{
        auth:true
      }
    },
    {
      path: '/exportImg',
      name: 'exportImg',
      component: ExportImg,
      meta:{
        auth:true
      }
    },
    {
      path:'*',
      name:'NotFound',
      component:NotFound,
    }
  ]
})
