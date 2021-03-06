// 封装网络请求

import axios from 'axios'

export default function request(option) {
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:8888/api/private/v1/',
        timeout: 60000,
        url: option.url,
        method: option.method || 'get',
        params: option.params || ''
    })
    instance.interceptors.request.use(config => {
        config.headers.Authorization = window.sessionStorage.getItem("token")
        return config
    })
    return instance(option)

}