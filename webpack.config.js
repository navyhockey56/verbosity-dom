const { ProgressPlugin } = require("webpack");

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  plugins: [
    new ProgressPlugin()
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    library: {
      name: 'verbosity-dom',
      type: 'umd',
    }
  }
};
