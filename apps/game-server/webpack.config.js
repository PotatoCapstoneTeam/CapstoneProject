// https://stackoverflow.com/questions/70484934/err-require-esm-from-webpacks-importing-an-esm-package

// TypeScript before version 4.6 does not support transpiling ESM imports to
// `import()`, but uses `require()` instead. NodeJS does not support the use
// of `require() for ECMAScript modules (ESM).
//
// Good reads:
// https://www.typescriptlang.org/docs/handbook/esm-node.html
// https://devblogs.microsoft.com/typescript/announcing-typescript-4-5/#esm-nodejs

/**
 * A Webpack 5 plugin that can be passed a list of packages that are of type
 * ESM. The typescript compiler will then be instructed to use the `import`
 * external type.
 */
class ESMLoader {
  static defaultOptions = {
    esmPackages: 'all',
  };

  constructor(options = {}) {
    this.options = { ...ESMLoader.defaultOptions, ...options };
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(
      'ECMAScript Module (ESM) Loader. Turns require() into import()',
      (compilation) => {
        compilation.hooks.buildModule.tap('Hello World Plugin', (module) => {
          if (
            module.type === 'javascript/dynamic' &&
            (this.options.esmPackages === 'all' ||
              this.options.esmPackages.includes(module.request))
          ) {
            // All types documented at
            // https://webpack.js.org/configuration/externals/#externalstype
            module.externalType = 'import';
          }
        });
      }
    );
  }
}

module.exports = function (webpackConfig, context) {
  // NodeJS supports dynamic imports since version 12.
  webpackConfig.target = 'node16';
  webpackConfig.plugins.push(
    // Manually specify the ESM modules or leave blank for using `import()`
    // on all packages.
    //new ESMLoader()
    new ESMLoader({ esmPackages: '@geckos.io/server' })
  );
  return webpackConfig;
};
