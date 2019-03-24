import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './connect.js'
Vue.prototype.$Http=axios;
Vue.config.productionTip = false;
/* 登入拦截 */
router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
     if (!sessionStorage.getItem('isLogin')) {
      next({
        path: 'login',
         query: {redirect: to.fullPath}  // 将跳转首页时的路由path作为参数，登录成功后跳转到该路由
      });
    }
  }
  next();
});
new Vue({
  router:router,
  store:store,
  render: h => h(App)/*,
  mounted(){
    this.$router.push('/');
  },*/
}).$mount('#app')
