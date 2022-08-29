#!/usr/bin/env node

import {execSync} from 'child_process';
import path from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';

import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_PATH = path.resolve(__dirname, '..');

function getAllPackageNamesToUpgrade() {
  const packagesDir = path.join(ROOT_PATH, 'packages');
  const decoder = new TextDecoder('utf-8');
  const findResult = execSync(`find ${packagesDir} -name "package.json" -print -maxdepth 2`);
  const packagesToUpgrade = decoder
    .decode(findResult.buffer)
    .split('\n')
    .map(packageJsonPath => packageJsonPath.trim())
    .filter(packageJsonPath => packageJsonPath)
    .map(packageJsonPath => fs.readFileSync(packageJsonPath, 'utf8'))
    .map(jsonString => JSON.parse(jsonString))
    .map(packageJson => packageJson.name);

  return packagesToUpgrade;
}

const packagesToUpgrade = getAllPackageNamesToUpgrade().join(' ');

console.log(
  chalk.cyan.bold(`Updating fixture app to consume the latest versions of these packages: ${packagesToUpgrade}.`),
);
execSync(`yarn upgrade ${packagesToUpgrade}`, {
  cwd: path.join(ROOT_PATH, 'fixture'),
  stdio: 'inherit',
});

console.log(chalk.cyan.bold("Updating fixture app's Podfile.lock."));
execSync(`bundle exec pod install`, {cwd: path.join(ROOT_PATH, 'fixture'), stdio: 'inherit'});

console.log(chalk.bold('📄 Updating the README file'));
execSync(`yarn generate readme`, {stdio: 'inherit', cwd: ROOT_PATH});

console.log(chalk.bold('🚀 Staging changes'));
execSync(`git add fixture && git add README.md`, {stdio: 'inherit', cwd: ROOT_PATH});
