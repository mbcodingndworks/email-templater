'use strict'

const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  entry: {
    monaco: './src/renderer/monaco.js',
    'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
    // 'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
    'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
    'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
    // 'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker'
  },
  output: {
    filename: '[name].renderer.bundle.js',
  },
})
