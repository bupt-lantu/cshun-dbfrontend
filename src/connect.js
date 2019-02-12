import axios from 'axios'
import router from './router'
axios.defaults.withCredentials=true;     //允许设置cookie
axios.defaults.baseURL='http://39.98.84.18:10081/api';

axios.interceptors.response.use(
    response => {
         return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                alert("请重新登录");
                console.log(error);
                sessionStorage.removeItem('isLogin');
                router.replace({
                    path: '/login',
                    query: {redirect: router.currentRoute.fullPath}
                });
            }
        }
        return Promise.reject(error.response.data)   // 返回接口返回的错误信息
    }
);

export default axios;