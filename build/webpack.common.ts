import path from 'path';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

export interface WebpackConfig extends Configuration {
  devServer?: WebpackDevServer.Configuration;
}
const devMode = process.env.NODE_ENV !== 'production';

const PROJECT_ROOT = path.resolve(__dirname, '../');
const config: WebpackConfig = {
  entry: path.join(PROJECT_ROOT, 'src/main'),
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, '../node_modules')],
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, '../src/'),
    },
  },
  // 开发环境下使用文件系统持久化缓存加快构建速度
  cache: devMode ? { type: 'filesystem' } : false,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(ts|js)x?$/i,
        exclude: [/node_modules/, /dist/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              // 使用默认的缓存目录读取构建结果，避免每次执行时重新编译可能产生的高性能消耗
              cacheDirectory: true,
              configFile: path.join(PROJECT_ROOT, 'babel.config.json'),
            },
          },
          {
            // Webpack 从下到上执行，ts-loader 编译完后再把产物交由 babel-loader 处理
            loader: 'ts-loader',
            options: {
              // 跳过 TypeScript 类型推导和检查，在 ForkTsCheckerWebpackPlugin 中执行，提高编译效率
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                exportLocalsConvention: 'camelCase',
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(PROJECT_ROOT, './index.html'),
      hash: true,
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new ESLintWebpackPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : 'static/css/[name].[contenthash].css',
      chunkFilename: devMode ? '[id].css' : 'static/css/[id].[contenthash].css',
      ignoreOrder: true,
    }),
    // 使用ModuleFederationPlugin实现模块联邦
    // new ModuleFederationPlugin({
    //   name: 'ModuleFederationDemo',
    //   remotes: {
    //     // 从COS上远程加载已构建资源
    //     'delivery-component': 'deliveryComponent@https://rdelivery-web-1258344701.file.myqcloud.com/mf-components/v0.1.0/index.js',
    //     // 也可以本地对delivery-component库build后，从本地加载资源
    //     // 'delivery-component': 'deliveryComponent@http://local.woa.com:8080/index.js',
    //   },
    //   shared: ['react-router-config', 'react-router-dom'],
    // }),
  ],
};

export default config;
