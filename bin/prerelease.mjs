#!/usr/bin/env node

import path from 'path';
import {execSync} from 'child_process';
import {fileURLToPath} from 'url';

import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_PATH = path.resolve(__dirname, '..');

console.log(chalk.bold('🔁 Checking out latest commits and setting up environment'));
execSync(`git checkout main`, {stdio: 'inherit', cwd: ROOT_PATH});
execSync(`git pull --tags`, {stdio: 'inherit', cwd: ROOT_PATH});
execSync(`yarn bootstrap`, {stdio: 'inherit', cwd: ROOT_PATH});
