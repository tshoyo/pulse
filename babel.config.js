module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      ["@babel/plugin-transform-export-namespace-from"],

      [
        "react-native-worklets-core/plugin",
        {
          globals: ["__labelImage"],
        },
      ],
    ],
    presets: ["babel-preset-expo"],
  };
};
