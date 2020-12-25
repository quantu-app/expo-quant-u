const { withExpoAdapter } = require("@expo/electron-adapter");

module.exports = withExpoAdapter({
  projectRoot: __dirname,
  // https://github.com/expo/expo-cli/issues/2835
  whiteListedModules: [
    "@aicacia/async_component-react",
    "@aicacia/state-forms",
    "@aicacia/state-react",
  ],
  // Provide any overrides for electron-webpack: https://github.com/electron-userland/electron-webpack/blob/master/docs/en/configuration.md
});
