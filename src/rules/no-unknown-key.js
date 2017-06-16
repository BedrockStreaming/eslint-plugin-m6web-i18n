import { getKeyValue, has } from '../utils/utils';

module.exports = langsKey => context => {
  let langConfig = [];
  const config = context.settings.i18n;

  if (!config || (config.ignoreFiles && new RegExp(config.ignoreFiles).test(context.getFilename()))) {
    return {};
  }

  if (config && config[langsKey]) {
    langConfig = config[langsKey].map(({ name, translationPath }) => ({
      name,
      translation: require(`${process.cwd()}/${translationPath}`),
    }));
  }

  return {
    CallExpression(node) {
      const funcName = (node.callee.type === 'MemberExpression' && node.callee.property.name) || node.callee.name;

      if (funcName !== config.functionName || !node.arguments || !node.arguments.length) {
        return;
      }

      const [keyNode, countNode] = node.arguments;
      const key = getKeyValue(keyNode);

      if (!key) {
        return;
      }

      if (typeof countNode === 'undefined') {
        langConfig.forEach(({ name, translation }) => {
          if (!has(translation, key)) {
            context.report({ node, severity: 2, message: `'${key}' is missing from '${name}' language` });
          }
        });
      } else if (config.pluralizedKeys && config.pluralizedKeys.length) {
        langConfig.forEach(({ name, translation }) => {
          const missingKeys = config.pluralizedKeys.reduce(
            (accumulator, plural) => (has(translation, `${key}.${plural}`) ? accumulator : accumulator.concat(plural)),
            [],
          );

          if (missingKeys.length) {
            context.report({
              node,
              message: `[${missingKeys}] keys are missing for key '${key}' in '${name}' language`,
            });
          }
        });
      }
    },
  };
};

module.exports.schema = [];
