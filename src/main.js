import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
axios.defaults.withCredentials=true;     //允许设置cookie
axios.defaults.baseURL='https://dev.cshun.gaojianli.me/api';
/* 需要重新登入 */
axios.interceptors.response.use(
  response => {
      return response;
  },
  error => {
      if (error.response) {
          switch (error.response.status) {
              case 401:
                  localStorage.removeItem('isLogin');
                  router.replace({
                      path: 'login',
                      query: {redirect: router.currentRoute.fullPath}
                  })
          }
      }
      return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });

Vue.prototype.$Http=axios;
Vue.config.productionTip = false;
/* 登入拦截 */
router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    if (!localStorage.getItem('isLogin')) {
      next({
        path: 'login',
         query: {redirect: to.fullPath}  // 将跳转首页时的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  next()
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
