import request from './request'


export function getAsideData(config) {
    return request({
        url: config.url,
        method: config.method
    })
}