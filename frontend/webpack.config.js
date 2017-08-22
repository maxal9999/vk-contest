'use strict';

const Webpack = require('webpack'),
   ExtractTextPlugin = require('extract-text-webpack-plugin'),
   NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
   entry: {
      boundle: ['./src/index.js']
   },
   output: {
      path: __dirname + '/dist',
      publicPath: '/dist/',
      filename: '[name].js',
      chunkFilename: '[name].js',
      library: '[name]'
   },
   resolve: {
      extensions: ['.js', '.less']
   },
   devServer: {
      contentBase: __dirname + '/dist',
      historyApiFallback: {
         index: 'index.html'
      }
   },
   watch: NODE_ENV === 'development',
   devtool: NODE_ENV === 'development' ? 'sheap-inline-module-source-map' : false,
   plugins: [
      new ExtractTextPlugin({
         filename: 'styles.css',
         allChunks: true
      }),
      new Webpack.NoEmitOnErrorsPlugin()
   ],
   module: {
      rules: [{
         test: /\.jsx?$/,
         exclude: /node_modules/,
         loader: 'babel-loader'
      }, {
         test: /\.less$/,
         exclude: /node_modules/,
         use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'postcss-loader', 'less-loader']
         })
      }]
   }
};

if(NODE_ENV === 'production') {
   module.exports.plugins.push(new Webpack.optimize.UglifyJsPlugin({
      compress: {
         warnings: false,
         drop_console: true,
         unsafe: true
      }
   }));
}