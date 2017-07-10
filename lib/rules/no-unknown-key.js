'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var minimatch = require('minimatch');

var _require = require('../utils/utils'),
    getKeyValue = _require.getKeyValue,
    has = _require.has,
    getLangConfig = _require.getLangConfig;

module.exports = function (langsKey) {
  return {
    meta: {
      docs: {
        description: 'ensures that used translate key is in translation file',
        category: 'Possible errors'
      },
      schema: []
    },
    create: function create(context) {
      var config = context.settings.i18n;

      if (!config || config.ignoreFiles && minimatch(context.getFilename(), config.ignoreFiles)) {
        return {};
      }

      return {
        CallExpression: function CallExpression(node) {
          var funcName = node.callee.type === 'MemberExpression' && node.callee.property.name || node.callee.name;

          if (funcName !== config.functionName || !node.arguments || !node.arguments.length) {
            return;
          }

          var _node$arguments = _slicedToArray(node.arguments, 3),
              keyNode = _node$arguments[0],
              countNode = _node$arguments[2];

          var key = getKeyValue(keyNode);

          if (!key) {
            return;
          }

          getLangConfig(config, langsKey).forEach(function (_ref) {
            var name = _ref.name,
                translation = _ref.translation;

            if (!translation) {
              context.report({
                node: node,
                severity: 2,
                message: '\'' + name + '\' language is missing'
              });

              return;
            }

            if (typeof countNode === 'undefined' && !has(translation, key)) {
              context.report({
                node: node,
                severity: 2,
                message: '\'' + key + '\' is missing from \'' + name + '\' language'
              });

              return;
            }

            if (countNode && Array.isArray(config.pluralizedKeys)) {
              var missingKeys = config.pluralizedKeys.filter(function (plural) {
                return !has(translation, key + '.' + plural);
              });

              if (missingKeys.length) {
                context.report({
                  node: node,
                  message: '[' + missingKeys + '] keys are missing for key \'' + key + '\' in \'' + name + '\' language'
                });
              }
            }
          });
        }
      };
    }
  };
};