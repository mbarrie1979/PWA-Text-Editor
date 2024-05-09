const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html', // Ensure this points to the right path
        title: 'JATE'
      }),
      new WebpackPwaManifest({
        name: 'Your App Name',
        short_name: 'App',
        description: 'Your App Description',
        background_color: '#ffffff',
        crossorigin: 'use-credentials',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512], 
            destination: path.join('assets', 'icons')
          }
        ]
      }),
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'service-worker.js'
      })
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext][query]' // Outputs images to 'dist/images'
          }
        }
      ],
    },
    devServer: {
      static: './dist', // Specifies the static files location
      hot: true, // Enable Hot Module Replacement
      port: 3000, // Specify the port to run on
      open: true // Automatically open the browser after the server starts
    }
  };
};


