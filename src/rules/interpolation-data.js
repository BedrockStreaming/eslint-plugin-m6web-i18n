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

        const [keyNode, dataNode] = node.arguments;
        const key = getKeyValue(keyNode);

        if (!key) {
          return;
        }

        getLangConfig(config, 'principalLangs').forEach(({ translation }) => {
          if (!translation) {
            return;
          }

          const value = get(translation, key);
          const [{ interpolationPattern }] = context.options;
          const interpolationTester = new RegExp(interpolationPattern);

          if (value && (!dataNode || dataNode.name === 'undefined') && interpolationTester.test(value)) {
            context.report({
              node,
              severity: 2,
              message: `'${key}' requires interpolation data.`,
            });

            return;
          }

          if (value && dataNode && dataNode.name !== 'undefined' && !interpolationTester.test(value)) {
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
