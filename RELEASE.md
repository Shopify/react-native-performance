# Releasing a new version

Releases **are done by Shopify engineers** following the steps below:

1. Run `yarn release`. This command will prompt you to update all the modules which have been touched since the last change. We try to keep the `main` branch always shippable. So all packages that have pending changes since the last release should be shipped simultaneously. To which versions the packages should be bumped will be automatically selected by `lerna`. Changelogs will be updated by `lerna` automatically as well.
3. The previous step would've created a new release commit on `main` and would've added some release tags. Push them to Github via `git push origin main --follow-tags`
3. Follow to the registry and deploy the package.
