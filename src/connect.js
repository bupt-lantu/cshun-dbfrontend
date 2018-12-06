import axios from 'axios'
import router from './router'
axios.defaults.withCredentials=true;     //允许设置cookie
axios.defaults.baseURL='https://dev.cshun.gaojianli.me/api';

axios.interceptors.response.use(
    response => {
        if(response.data.code && response.data.code===401)
        {
            alert(response.data.msg);
            sessionStorage.removeItem('isLogin');
            router.replace({
                path: 'login',
                query: {redirect: router.currentRoute.fullPath}
            });
        }
        else
            return response;
    }
);

export default axios;