module.exports = {
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production'
        ? '/github-gollowers/'
        : './',
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.less?$/,
                    use: [
                        {
                            loader: 'less-loader',
                            options: {
                                lessOptions: {
                                    javascriptEnabled: true
                                }
                            },
                        },

                    ]
                }
            ]
        }
    }
}