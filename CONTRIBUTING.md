# Contributing

We want this community to be **friendly and respectful** to each other. Please follow our [Code of Conduct](./CODE_OF_CONDUCT.md) in all your interactions with the project.

## Development workflow

To get started with the project, run `yarn bootsrap` in the root directory to install the required dependencies for each package:

```sh
yarn bootsrap
```

>  This project uses [`yarn`](https://classic.yarnpkg.com/) as a package manager. While it's possible to run individual commands with [`npm`](https://github.com/npm/cli), please refrain from using it, especially `npm install.` 🙅

While developing, you can run the [fixture app](/fixture/) to test your changes. Any changes you make in your library's JavaScript code will be reflected in the example app without a rebuild. If you change any native code, then you'll need to rebuild the example app.

To start the packager:

```sh
yarn start
```

To run the fixture app on Android:

```sh
yarn android
```

To run the example app on iOS:

```sh
yarn ios
```

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
yarn flightcheck
```

To fix formatting errors, run the following:

```sh
yarn lint --fix
```

Remember to add tests for your change if possible. Run the unit tests by:

```sh
yarn test
```

###  Working with documentation website

The repo contains a documentation website build with [Docusaurus](https://docusaurus.io/). Please make sure that your changes are reflected in the documentation, if it's API or configuration changes. Any improvements to documentation itself are also welcomed.

Source files for documentation can be found in [./documentation/docs](./documentation/docs) folder.

To start working with documentation and run it locally:

1. `cd documentation && yarn`
2. `yarn run build && yarn run server`

Now local website is running at http://localhost:3000

### Linting and tests

[ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [TypeScript](https://www.typescriptlang.org/)

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) and [@shopify/eslint-plugin](https://www.npmjs.com/package/@shopify/eslint-plugin) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing.


### Scripts

The `package.json` file contains various scripts for common tasks:

- `yarn up`: setup project by installing all dependencies and pods.
- `yarn typescript`: type-check files with TypeScript.
- `yarn lint`/`yarn lint --fix`: lint files with ESLint/try to fix lint issues.
- `yarn flightcheck`: check types, linting, and tests all together.
- `yarn test`: run unit tests with Jest.
- `yarn start`: start the Metro server for the example app.
- `yarn android`: run the example app on Android.
- `yarn ios`: run the example app on iOS.
- `yarn release`: prepare all packages for release.

### Submitting pull requests

Please take some time to correctly fill our [pull request template](https://github.com/Shopify/react-native-performance/blob/main/.github/PULL_REQUEST_TEMPLATE.md) and detail the proposed changes. This will help reviewers to better understand the context of your PR and provide valuable insights.

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Before pushing your branch make sure to locally run the `yarn flightcheck` command (which does all of the following: `yarn build`, `yarn test` and `yarn lint`). This should save you some time and prevent the CI pipeline from blocking your PR.
- Update the documentation if your PR changes the API.
- Follow the pull request template when opening a pull request.
- If your PR is a new feature and not a bug fix, consider opening an issue describing your idea. This ensures you get feedback from the maintainers and don't write code that might not be used.

### Conventional commits

To make releases easier, we adhere to conventional commits as specified [here](https://www.conventionalcommits.org/en/v1.0.0/).
If you create a PR, you can either edit the PR title and then do "Squash and rebase". If you need multiple commits, then make sure that all the PR commits comply with the conventional commits specification and then you can do "Rebase and merge".

There is a CI check that will check whether either of those holds true.

### Releasing a new version

Releases **are done by Shopify engineers** following the steps on [RELEASE.md](./RELEASE.md).
