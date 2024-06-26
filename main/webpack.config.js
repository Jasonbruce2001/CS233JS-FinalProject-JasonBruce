const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = require("html-webpack-plugin");
const copyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: {
      general: './src/js/general.js',
      index: './src/js/index.js',
      search: './src/js/search.js',
      lists: './src/js/lists.js',
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: '[name].bundle.js',
      assetModuleFilename: "images/[name][ext]",
      clean: true,
    },
    target: 'web',
    devServer: { 
      static: "./dist"
    }, 
    devtool: 'source-map', 
    module: {
      rules: [	
        { 
          test: /\.js$/i,
          exclude: /(node_modules)/,
          use: { 
            loader: 'babel-loader', 
            options: {
            presets: ['@babel/preset-env']
          }}
        }, 
        { 
          test: /\.css$/i, 
          use: [ 'style-loader', 'css-loader' ]		
        },
        { 
            test: /.s[ac]ss$/i, 
            use: [ 'style-loader', 'css-loader' , 'sass-loader']		
        },
        {  
          test: /\.(svg|eot|ttf|woff|woff2)$/i,  
          type: "asset/resource",
        },
        {
          test: /\.(png|jpg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new htmlWebpackPlugin({
        template: path.resolve(__dirname, "./src/index.html"),
        chunks: ["index"],
        inject: "body",
        filename: "index.html",
      }),
      new htmlWebpackPlugin({
        template: path.resolve(__dirname, "./src/search.html"),
        chunks: ["search"],
        inject: "body",
        filename: "search.html",
      }),
      new htmlWebpackPlugin({
        template: path.resolve(__dirname, "./src/lists.html"),
        chunks: ["lists"],
        inject: "body",
        filename: "lists.html",
      }),
      /* new copyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "src/images"),
            to: path.resolve(__dirname, "dist/images"),
          },
        ],
      }),
      */
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
}
  