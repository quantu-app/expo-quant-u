const defaultConfig = require("@expo/metro-config").getDefaultConfig(__dirname),
  MetroConfig = require("@ui-kitten/metro-config");

const evaConfig = {
  evaPackage: "@eva-design/eva",
  customMappingPath: "./custom-mapping.json",
};

module.exports = MetroConfig.create(evaConfig, defaultConfig);
