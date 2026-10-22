'use strict'

const { merge } = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  entry: {
    libs: './src/renderer/libs.js',
    // strings: './src/renderer/strings.js',
  },
  output: {
    filename: '[name].renderer.bundle.js',
  },
  devServer: {
    static: path.resolve(__dirname, './src/dist'),
    port: 8080,
    hot: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],
})
