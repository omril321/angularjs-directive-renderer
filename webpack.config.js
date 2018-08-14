const path = require("path");

module.exports = {
  entry: ["./src/renderIsolatedDirective/index.js"],
  output: {
    path: path.join(__dirname, "build/"),
    filename: "renderIsolatedDirective.js"
  },
  module: {
    strictExportPresence: true,
    rules: [
      // Load js files through Babel
      { test: /\.(js|jsx)$/,   loader: "babel-loader" }
    ]
  },
};