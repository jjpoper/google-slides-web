import path from 'path'; // 必须引入path 否则报错

module.exports = {
  chainWebpack: config => {
    const imagesRule = config.module.rule('images');
    imagesRule.uses.clear() // 清除原本的images loader配置
    imagesRule
      .test(/\.(jpg|gif|png|svg)$/)
      .exclude
      .add(path.join(__dirname, "./")) // 不对图片转base64
      .end()
      .use('url-loader')
      .loader('url-loader')
      .options({name: "assets/[name].[hash:8].[ext]", limit: 1})
  }
}
