const path = require('path');

const glob = require('glob');

const alias = Object.fromEntries(
  glob.sync('../packages/react-native-*').map(packagePath => {
    return [`@shopify/${path.basename(packagePath)}`, path.join(path.resolve(packagePath), 'src')];
  }),
);

module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        root: './src',
        cwd: 'babelrc',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias,
      },
    ],
    'react-native-reanimated/plugin',
  ],
  presets: ['module:metro-react-native-babel-preset'],
};
