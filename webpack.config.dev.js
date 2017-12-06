var path = require('path');
var fs = require('fs'); 
var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin=require('extract-text-webpack-plugin');
var basePath = 'build';
module.exports = {
  entry:{
    'entry':'./src/entry.js'
  },
  output: {
    path: path.join(__dirname, basePath),
    filename: '[name].[hash].bundle.js',
    publicPath: basePath
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    // 定义全局环境变量为开发环境
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new AssetsPlugin({
      filename: basePath + '/webpack-assets.js',
      processOutput: function (assets) {
		if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath);
        }
        return 'window.WEBPACK_ASSETS = ' + JSON.stringify(assets);
      }
    }),
    new ExtractTextPlugin('css.all.css')
  ],
  resolve: {
    // 实际就是自动添加后缀，默认是当成js文件来查找路径
    // 空字符串在此是为了resolve一些在import文件时不带文件扩展名的表达式
    extensions: ['', '.js', 'jsx'],

    // 路径别名
    alias:{
      containers: path.resolve(__dirname, 'src/js/containers'),
      component: path.resolve(__dirname, 'src/js/component'),
      // 以前你可能这样引用 import { Nav } from '../../containers'
      // 现在你可以这样引用 import { Nav } from 'app/containers'

      images:path.resolve(__dirname, 'src/images')

      // 注意：别名只能在.js文件中使用。
    }
  },
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.(css|less)$/,
        loader:'style!css?modules&localIdentName=[local]!less'
      },
      {
        test: /(fontawesome-webfont|glyphicons-halflings-regular)\.(woff|woff2|ttf|eot|svg)($|\?)/,
        loader: 'url?limit=1024&name=fonts/[name].[hash].[ext]'
      },
      {
        test: /\.(jpg|png)$/,
        loader: "url?limit=100000"
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ],
    postLoaders: [
      {
        test: /\.js$/,
        loaders: ['es3ify-loader'],
      },
    ],
  }
};
