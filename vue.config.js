module.exports = {
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/git-followers/' : './',
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
              }
            }
          ]
        }
      ]
    }
  }
}
