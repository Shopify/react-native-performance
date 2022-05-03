const path = require('path');

const glob = require('glob');

// Get all the local packages
const packages = glob.sync('../packages/react-native-*').map(packagePath => path.resolve(packagePath));
let watchFolders = packages;
watchFolders = watchFolders.concat([path.join(__dirname, './node_modules')]);
watchFolders = watchFolders.concat([path.join(__dirname, '../node_modules')]);

const {getDefaultConfig} = require('metro-config');

module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();

  return {
    transformer: {
      getTransformOptions: () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'cjs'],
    },
    watchFolders,
  };
})();
