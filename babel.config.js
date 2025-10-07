module.exports = {
  presets: ['module:@react-native/babel-preset'],
    plugins: [
    // ... other plugins
    'react-native-reanimated/plugin', // 👈 Add this line (MUST be LAST)
  ],
};
