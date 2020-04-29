const path = require('path')
const webpack = require('webpack')
const server = require('./public/serverconfig.json')

const resolve = dir => {
    return path.join(__dirname, dir)
}

// 线上打包路径，请根据项目实际线上情况
const publicPath = process.env.NODE_ENV === 'production' ? '/' : '/'

module.exports = {
    publicPath: publicPath,
    outputDir: 'dist', // 打包生成的生产环境构建文件的目录
    assetsDir: 'assets', // 放置生成的静态资源路径，默认在outputDir
    indexPath: 'index.html', // 指定生成的 index.html 输入路径，默认outputDir
    pages: undefined, // 构建多页
    productionSourceMap: false, // 开启 生产环境的 source map?
    chainWebpack: config => {
        // 配置路径别名
        config.resolve.extensions
            .add('.vue')
            .add('.ts')
            .add('.json')
        config.resolve.alias
            .set('@', resolve('src'))
            .set('_c', resolve('src/component'))
    },
    css: {
        modules: false, // 启用 CSS modules
        extract: true, // 是否使用css分离插件
        sourceMap: false, // 开启 CSS source maps?
        loaderOptions: {
            less: {
                javascriptEnabled: true
            },
            // postcss: {
            //     plugins: [
            //         require('postcss-pxtorem')({
            //             // 把px单位换算成rem单位
            //             rootValue: 192, // 换算的基数(设计图750的根字体为32)(需求：设计图1920根字体16)
            //             selectorBlackList: ['weui', 'mu'], // 忽略转换正则匹配项
            //             propList: ['*']
            //         })
            //     ]
            // }
        } // css预设器配置项
    },
    devServer: {
        port: process.env.port || 8081, // 端口
        https: false,
        proxy: {
            '/api': {
                target: server.ApiUrl,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: []
        }
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery'
            })
        ],
        externals: {
            Cesium: 'Cesium',
            zlib: 'Zlib'
        }
    }
}