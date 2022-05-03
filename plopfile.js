const {readdirSync, existsSync} = require('fs');
const path = require('path');

const jsPackages = getPackages('js');

module.exports = function (plop) {
  plop.setGenerator('readme', {
    description: "Generates root's README",
    prompts: [],
    actions: () => {
      return [
        {
          type: 'add',
          path: `README.md`,
          templateFile: 'templates/README_ROOT.hbs.md',
          force: true,
          data: {
            packages: jsPackages,
          },
        },
      ];
    },
  });
};

function getPackages(type = 'js') {
  const packagesPath = path.join(__dirname, type === 'js' ? 'packages' : 'gems');

  return readdirSync(packagesPath).reduce((acc, packageName) => {
    const packageJSONPath = path.join(packagesPath, packageName, 'package.json');

    if (existsSync(packageJSONPath)) {
      const packageJSON = require(packageJSONPath);
      let {name} = packageJSON;
      const {version} = packageJSON;
      name = name.replace('@shopify/', '');
      const releaseTag = encodeURIComponent(`@shopify/${name}@${version}`);

      acc.push({
        name,
        version,
        releaseTag,
      });
    }

    return acc;
  }, []);
}
