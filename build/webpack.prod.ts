import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';
import type { WebpackPluginInstance } from 'webpack';
import commonConfig from './webpack.common';

// `npm run build --report`
const isReport = process.env.npm_config_report;
const publicPath = process.env.PUBLIC_PATH || './';

const plugins: WebpackPluginInstance[] = [new CssMinimizerPlugin(), new CleanWebpackPlugin()];
if (isReport) {
  plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}
const PROJECT_ROOT = path.resolve(__dirname, '../');
process.env.NODE_ENV = 'production';
const config: Configuration = merge(commonConfig, {
  mode: 'production',
  output: {
    path: path.join(PROJECT_ROOT, 'dist'),
    assetModuleFilename: 'static/[name].[hash][ext]',
    filename: 'static/js/[name].[contenthash].js',
    publicPath,
    // 对外输出的是一个库的时候需要
    // library: {
    //   name: 'app',
    //   type: 'umd',
    // },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // 构建时去除备注信息
          format: { comments: false },
        },
        // 构建时取消生成 license.txt 等备注文件
        extractComments: false,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      // 拆分 chunk 的名称。设为 false 将保持 chunk 的相同名称，因此不会不必要地更改名称。这是生产环境下构建的建议值
      name: false,
    },
    runtimeChunk: {
      // 为每个入口添加一个单独的 runtime chunk 文件
      name: (entrypoint: { name: string }) => `runtime~${entrypoint.name}`,
    },
  },
  plugins,
});

export default config;
