// const path = require('path'); // 必须引入path 否则报错
// const CompressionPlugin = require('compression-webpack-plugin')

// module.exports = {
//   chainWebpack: config => {
//     const imagesRule = config.module.rule('images');
//     imagesRule.uses.clear() // 清除原本的images loader配置
//     imagesRule
//       .test(/\.(jpg|gif|png|svg)$/)
//       .exclude
//       .add(path.join(__dirname, "./")) // 不对图片转base64
//       .end()
//       .use('url-loader')
//       .loader('url-loader')
//       .options({ name: "assets/[name].[hash:8].[ext]", limit: 1 })
//   },
//   configureWebpack: config => {
//     console.log(process.env.NODE_ENV, 'process.env.NODE_ENV')
//     if(process.env.NODE_ENV === 'production') {
//       return {
//         plugins: [
//           new CompressionPlugin({
//             test: /\.js$|\.html$|.\css/, // 匹配文件名
//             threshold: 10240, // 对超过10k的数据压缩
//             deleteOriginalAssets: false // 不删除源文件
//           })
//         ]
//       }
//     }
//   },
// }
