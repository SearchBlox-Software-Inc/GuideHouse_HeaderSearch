const path = require("path");
const webpack = require("webpack");
import ExtractTextPlugin from 'extract-text-webpack-plugin';
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production')
};

module.exports = {
  // debug: true,
  devtool: 'source-map',
  // noInfo: false,
  entry: [path.resolve(__dirname, "src/index")],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js',
    publicPath: "/"
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
    noEmitOnErrors: true
  },
  module: {
    rules:[
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        use: {
          loader: "babel-loader"
        }
      },
      // {test: /\.txt$/, use: "raw-loader"},
      {test: /\.css$/, use: [
        {loader: "style-loader"},
        {loader: "css-loader"},
        {loader: "sass-loader"}
      ]},
      {
          test: /\.(gif|jpe?g|png|svg)$/i,
          use: [{
              loader: 'url-loader'
          }]
      },
      {
          test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
              loader: 'url-loader'
          }]
      }
    ]
  },
  plugins: [
    // new HtmlWebpackPlugin({template: './src/index.html'}),
    // new webpack.noErrorsPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new ExtractTextPlugin('styles.css'),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.UglifyJsPlugin(),
    // new CopyWebpackPlugin([{ from: './src/sb_config.js'}])
    new CopyWebpackPlugin([{ from: './src/favicon.ico'}]),
    new CopyWebpackPlugin([{ from: './src/favicon.png'}]),
    new CopyWebpackPlugin([{ from: './src/facet.js'}]),
    // new BundleAnalyzerPlugin()
  ],
  devServer: {
    contentBase: "./dist"
  }
};
