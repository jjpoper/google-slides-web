import path from 'path'; // 必须引入path 否则报错

module.exports = {
  chainWebpack: config => {
    // 设置图片不转base64格式  图片少 且对图片质量要求高
    const imagesRule = config.module.rule('images');
    imagesRule.uses.clear() // 清除原本的images loader配置
    imagesRule
    .test(/\.(jpg|gif|png|svg)$/)
    .exclude
    .add(path.join(__dirname, "../node_modules")) // 去除node_modules里的图片转base64配置
    .end()
    .use('url-loader')
    .loader('url-loader')
    .options({name: "img/[name].[hash:8].[ext]", limit: 1})
  },
}
