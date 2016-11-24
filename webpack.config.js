'use strict'
var webpack = require('webpack')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

var env = process.env.NODE_ENV

var config = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'JsConstraint',
    libraryTarget: 'umd'
  },
  plugins: [
    new LodashModuleReplacementPlugin,
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
}

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
  config.plugins.push(new webpack.optimize.DedupePlugin())
}

module.exports = config
