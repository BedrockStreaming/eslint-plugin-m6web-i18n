const minimatch = require('minimatch');
const { getKeyValue, get, getLangConfig } = require('../utils/utils');

module.exports = {
  meta: {
    docs: {
      description: 'ensures that interpolated translate key have data',
      category: 'Possible errors',
    },
    schema: [
      {
        type: 'object',
        required: ['interpolationPattern'],
        properties: {
          interpolationPattern: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const config = context.settings.i18n;

    if (!config || (config.ignoreFiles && minimatch(context.getFilename(), config.ignoreFiles))) {
      return {};
    }

    return {
      CallExpression(node) {
        const funcName = (node.callee.type === 'MemberExpression' && node.callee.property.name) || node.callee.name;

        if (funcName !== config.functionName || !node.arguments || !node.arguments.length) {
          return;
        }

        const [keyNode, dataNode, countNode] = node.arguments;
        const key = getKeyValue(keyNode);

        if (!key) {
          return;
        }

        getLangConfig(config, 'principalLangs').forEach(({ translation }) => {
          if (!translation) {
            return;
          }

          const isPluralized = !!countNode && Array.isArray(config.pluralizedKeys);
          const translateValue = get(translation, key);
          const [{ interpolationPattern }] = context.options;
          const interpolationTester = new RegExp(interpolationPattern);

          let values;
          if (isPluralized) {
            values = Object.values(translateValue);
          } else {
            values = translateValue ? [translateValue] : [];
          }

          if ((!dataNode || dataNode.name === 'undefined') && values.some(value => interpolationTester.test(value))) {
            context.report({
              node,
              severity: 2,
              message: `'${key}' requires interpolation data.`,
            });

            return;
          }

          if (dataNode && dataNode.name !== 'undefined' && !values.some(value => interpolationTester.test(value))) {
            context.report({
              node,
              severity: 2,
              message: `'${key}' doesn't require any interpolation data.`,
            });
          }
        });
      },
    };
  },
};
