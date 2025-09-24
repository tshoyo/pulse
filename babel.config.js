module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      ["@babel/plugin-transform-export-namespace-from"],
      [
        "react-native-reanimated/plugin",
        {
          globals: ["__labelImage"],
        },
      ]["react-native-worklets-core/plugin"],
    ],
    presets: ["babel-preset-expo"],
  };
};
