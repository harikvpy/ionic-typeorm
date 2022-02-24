const webpack = require("webpack");
console.log("The custom config is used");
module.exports = {
  resolve: {
    fallback: {
      "path": false,
      "fs": false,
      "crypto": false,
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      "window.SQL": "sql.js/dist/sql-wasm.js",
    }),
    new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
      result.request = result.request.replace(/typeorm/, "typeorm/browser");
    }),
  ],
  optimization: {
    minimize: false,
  },
};
