module.exports = {
  dependencies: {
    '@hssdiv/react-native-sensors-native-module': {
      platforms: {
        android: {
          packageInstance: "new RNSensorsNativeModulePackage(getApplicationContext())",
        },
      },
    },
  },
};