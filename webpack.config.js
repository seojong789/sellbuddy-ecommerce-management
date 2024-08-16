const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const IS_PRODUCTION = argv.mode === 'production';

  return {
    entry: {
      home: ['./src/home.js', './src/home.css'],
      login: ['./src/pages/login/login.js', './src/pages/login/login.css'],
      main: ['./src/pages/main/main.js', './src/pages/main/main.css'],
      sales: ['./src/pages/sales/sales.js', './src/pages/sales/sales.css'],
      'analysis-detail': [
        './src/pages/analysis/detail/analysis-detail.js',
        './src/pages/analysis/detail/analysis-detail.css',
      ],
      'analysis-main': [
        './src/pages/analysis/main/analysis.js',
        './src/pages/analysis/main/analysis.css',
      ],
      index: './src/index.css',
      sidebar: './src/components/sidebar.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      publicPath: '/',
    },
    devServer: {
      hot: true,
      port: 8080,
      open: true,
      historyApiFallback: true,
      compress: true,
      static: {
        directory: path.join(__dirname, 'dist'),
      },
    },
    devtool: IS_PRODUCTION ? 'source-map' : 'eval-cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve(__dirname, 'babel.config.json'),
            },
          },
        },
        {
          test: /\.css$/i,
          use: [
            IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/home.html',
        filename: 'index.html',
        chunks: ['home'],
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/login/login.html',
        filename: 'login.html',
        chunks: ['login'],
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/main/main.html',
        filename: 'main.html',
        chunks: ['main', 'index', 'sidebar'],
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/sales/sales.html',
        filename: 'sales.html',
        chunks: ['sales', 'index', 'sidebar'],
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/analysis/detail/analysis-detail.html',
        filename: 'analysis-detail.html',
        chunks: ['analysis-detail', 'index', 'sidebar'],
      }),
      new HtmlWebpackPlugin({
        template: './src/pages/analysis/main/analysis.html',
        filename: 'analysis-main.html',
        chunks: ['analysis-main', 'index', 'sidebar'],
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/assets/images'),
            to: 'assets/images',
          },
          {
            from: path.resolve(__dirname, 'src/assets/json'),
            to: 'assets/json',
          },
        ],
      }),
      new Dotenv(),
    ],
  };
};
