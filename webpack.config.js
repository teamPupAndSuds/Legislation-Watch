var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'client/dist');
var APP_DIR = path.resolve(__dirname, 'client');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.jsx?$/,
        include: APP_DIR,
        exclude: /node_modules/,
        presets: ['es2015', 'react'],
        plugins: ['transform-es2015-arrow-functions']
      }
    ]
  },
  devServer: { 
    inline: true,
  }
};

module.exports = config;