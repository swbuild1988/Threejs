import request from '@/util/request'

export default async () => {
    // 根据生产环境还是开发环境读取配置文件
    let isProducetion: boolean = process.env.NODE_ENV === 'production'
    let config: any = isProducetion ?
        (await request.get('../serverconfig.json')).data :
        require('../../public/serverconfig.json')

    console.log("config", config)

    request.defaults.baseURL = isProducetion ? config.ApiUrl : 'http://localhost:8081/api'
}