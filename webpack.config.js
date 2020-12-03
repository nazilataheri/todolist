const path = require("path");

module.exports = {
  resolve: {
    modules: [path.resolve("./lib"), path.resolve("./node_modules")],
  },
  entry: ["@babel/polyfill", "./src/components/Index.js"],
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-react",
                "@babel/preset-env",
                {
                  plugins: [
                    "@babel/plugin-proposal-class-properties",
                    "@babel/plugin-proposal-object-rest-spread",
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        test: /\.json5$/i,
        loader: "json5-loader",
        options: {
          esModule: false,
        },
        type: "javascript/auto",
      },
    ],
  },
};
