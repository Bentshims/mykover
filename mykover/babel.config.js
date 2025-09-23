// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//     plugins: [
//       // Plugin NativeWind pour Tailwind CSS
//       'nativewind/babel',
//       // Plugin Reanimated - configuration simplifiée
//       ['react-native-reanimated/plugin', {
//         relativeSourceLocation: true,
//       }],
//     ],
//   };
// };
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin',
    ],
  };
};

