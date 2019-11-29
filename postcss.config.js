// 后处理器的配置文件
module.exports = {
  plugins: {
    // 自动加上私有前缀
    'autoprefixer': {},

    // 自动px单位换算rem单位
    'postcss-pxtorem': {
      rootValue: 37.5, // 换算基准值
      propList: ['*']// 所有px单位都换算rem
    }
  }
}
