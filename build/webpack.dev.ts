import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import commonConfig from './webpack.common';

const config: Configuration = merge(commonConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  // 开发环境下使用文件系统持久化缓存加快构建速度
  cache: { type: 'filesystem' },
  devServer: {
    port: 3002,
    open: true,
    // 远程开发时可以通过 IP 访问
    // host: '0.0.0.0',
    // 代理访问时跳过 host 检查
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // 设置代理
    // proxy: {
    //   '/cgi/v1': {
    //     target: 'http://xxxx',
    //     changeOrigin: true,
    //   },
    // },
  },
  optimization: {
    // 开发环境不压缩
    minimize: false,
    splitChunks: {
      chunks: 'all',
      // 开发环境下合并为一个 chunk
      name: 'chunk',
    },
  },
});
export default config;
