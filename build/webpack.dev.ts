import { join, resolve } from 'path';
import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import commonConfig from './webpack.common';

const publicPath = 'http://localhost:3002/';
const config: Configuration = merge(commonConfig, {
  mode: 'development',
  output: {
    path: join(resolve(__dirname, '../'), 'dist'),
    assetModuleFilename: 'static/[name].[hash][ext]',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath,
    library: 'release',
    libraryTarget: 'umd',
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 3002,
    // 微前端模式下禁用热更新
    hot: false,
    // 远程开发时可以通过 IP 访问
    host: '0.0.0.0',
    // 代理访问时跳过 host 检查
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/cgi/v1': {
        target: 'http://test.portal.rdelivery.woa.com',
        changeOrigin: true,
      },
    },
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
