const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ["@ui-kitten/components"],
      },
      // Passing true will enable the default Workbox + Expo SW configuration.
      offline: true,
    },
    argv
  );
  // Customize the config before returning it.
  return config;
};
