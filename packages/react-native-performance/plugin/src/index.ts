import {
  ConfigPlugin,
  withAppDelegate,
  withMainApplication,
  withPlugins,
  withProjectBuildGradle,
} from '@expo/config-plugins';
import {mergeContents} from '@expo/config-plugins/build/utils/generateCode';
import {addImports} from '@expo/config-plugins/build/android/codeMod';

const MATCH_DID_FINISH_LAUNCHING_IOS =
  /-\s*\(BOOL\)\s*application:\s*\(UIApplication\s*\*\s*\)\s*\w+\s+didFinishLaunchingWithOptions:/g;

const MATCH_ON_CREATE = /super\.onCreate\(\);/;
const MATCH_DEPENDANCIES = /dependencies {/;

const withRequiredIOSSetup: ConfigPlugin = expoConfig => {
  const importStatement = '#import <ReactNativePerformance/ReactNativePerformance.h>';
  const newLine = '  [ReactNativePerformance onAppStarted];\n';

  return withAppDelegate(expoConfig, iosConfig => {
    if (!['objc', 'objcpp'].includes(iosConfig.modResults.language)) {
      throw new Error(
        "@shopify/react-native-performance config plugin does not support AppDelegate' that aren't Objective-C(++) yet.",
      );
    }

    iosConfig.modResults.contents = mergeContents({
      tag: 'react-native-performance-import-ios',
      src: iosConfig.modResults.contents,
      newSrc: importStatement,
      offset: 0,
      comment: '//',
      anchor: '',
    }).contents;

    iosConfig.modResults.contents = mergeContents({
      tag: 'react-native-performance-didFinishLaunchingWithOptions-ios',
      src: iosConfig.modResults.contents,
      newSrc: newLine,
      offset: 2,
      comment: '//',
      anchor: MATCH_DID_FINISH_LAUNCHING_IOS,
    }).contents;

    return iosConfig;
  });
};

const withRequiredAndroidMainApplicationSetup: ConfigPlugin = expoConfig => {
  const importStatement = 'com.shopify.reactnativeperformance.ReactNativePerformance';
  const newLine = '    ReactNativePerformance.onAppStarted();\n';
  return withMainApplication(expoConfig, async androidConfig => {
    if (androidConfig.modResults.language !== 'java') {
      throw new Error('@shopify/react-native-performance config plugin does not support kotlin MainActivity yet.');
    }

    const srcWithNewImport = addImports(
      androidConfig.modResults.contents,
      [importStatement],
      androidConfig.modResults.language === 'java',
    );

    androidConfig.modResults.contents = mergeContents({
      tag: 'react-native-performance-onCreate-android',
      src: srcWithNewImport,
      newSrc: newLine,
      anchor: MATCH_ON_CREATE,
      offset: 0,
      comment: '//',
    }).contents;

    return androidConfig;
  });
};

const withRequiredAndroidBuildGradleSetup: ConfigPlugin = expoConfig => {
  const newLine = "        classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:1.8.0+')";
  return withProjectBuildGradle(expoConfig, async androidConfig => {
    androidConfig.modResults.contents = mergeContents({
      tag: 'react-native-performance-appBuildGradle-android',
      src: androidConfig.modResults.contents,
      newSrc: newLine,
      anchor: MATCH_DEPENDANCIES,
      offset: 1,
      comment: '//',
    }).contents;

    return androidConfig;
  });
};

const withReactNativePerformanceSetup: ConfigPlugin = config => {
  return withPlugins(config, [
    withRequiredIOSSetup,
    withRequiredAndroidBuildGradleSetup,
    withRequiredAndroidMainApplicationSetup,
  ]);
};

export default withReactNativePerformanceSetup;
