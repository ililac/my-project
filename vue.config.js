module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 9999,
        proxy: {
            '/zhfw': {
                // target: 'http://139.198.16.175:8065',  // 请求本地 需要xboot后台项目
                target: 'http://127.0.0.1:7072',
                ws: false
            },
			'/compare': {
                target: 'http://casm.pkulaw.cn/dz1/cross_domain.ashx',  // 请求本地 需要xboot后台项目
                ws: false
            },
            '/foo': {
                target: '<other_url>'
            },
            '/ws':
            {
                // target: 'http://139.198.16.175:8075',  // 请求本地 需要xboot后台项目
                target: 'http://127.0.0.1:7074',
                ws: false
            }

        }
    },
    // 打包时不生成.map文件 避免看到源码
    productionSourceMap: false
}