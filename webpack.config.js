const path = require("path");

module.exports = {
  entry: "./init.js", // Entry point is init.js
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "veli.js", // Output file name (emit ES module)
    library: {type: "module"},
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Transpile JavaScript files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/, // Handle CSS files
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".css"], // File extensions to resolve
  },
  mode: "production", // Set to 'development' for debugging
};

// When emitting an ES module library, enable the outputModule experiment
module.exports.experiments = module.exports.experiments || {};
module.exports.experiments.outputModule = true;
