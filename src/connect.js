import axios from 'axios'
import router from './router'
axios.defaults.withCredentials=true;     //允许设置cookie
axios.defaults.baseURL='https://dev.cshun.gaojianli.me/api';
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // if (error.response) {
        //     switch (error.response.status) {
        //         case 401:
        //             localStorage.removeItem('isLogin');
        //             router.replace({
        //                 path: 'login',
        //                 query: {redirect: router.currentRoute.fullPath}
        //             })
        //     }
        // }
        localStorage.removeItem('isLogin');
        router.replace({
            path: 'login',
            query: {redirect: router.currentRoute.fullPath}
          });
        return Promise.reject(error.response.data)   // 返回接口返回的错误信息
});

export default axios;