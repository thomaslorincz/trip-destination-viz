const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const workboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    main: './src/client/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  target: 'web',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {loader: 'babel-loader'},
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {minimize: true},
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: 'assets', to: 'images'},
      {from: 'src/client/manifest.json'},
    ]),
    new HtmlWebPackPlugin({
      template: './src/client/index.html',
      filename: 'index.html',
      excludeChunks: ['server'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new CompressionPlugin({
      filename: '[path].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html)$/,
      deleteOriginalAssets: true,
    }),
    new workboxPlugin.GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https:\/\/fonts\.googleapis\.com/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets',
          },
        },
        {
          // eslint-disable-next-line
          urlPattern: /^https:\/\/api\.mapbox\.com\/mapbox-gl-js\/v1\.0\.0\/mapbox-gl\.css$/,
          handler: 'StaleWhileRevalidate',
        },
      ],
    }),
  ],
};
