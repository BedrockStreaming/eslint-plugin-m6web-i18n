'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _utils = require('../utils/utils');

module.exports = function (langsKey) {
  return function (context) {
    var langConfig = [];
    var config = context.settings.i18n;
    if (config && config[langsKey]) {
      langConfig = config[langsKey].map(function (_ref) {
        var name = _ref.name,
            translationPath = _ref.translationPath;
        return {
          name: name,
          translation: require(process.cwd() + '/' + translationPath)
        };
      });
    }

    if (config.ignoreFiles && new RegExp(config.ignoreFiles).test(context.getFilename())) {
      return {};
    }

    return {
      CallExpression: function CallExpression(node) {
        var funcName = node.callee.type === 'MemberExpression' && node.callee.property.name || node.callee.name;
        if (funcName !== config.functionName || !node.arguments || !node.arguments.length) {
          return;
        }

        var _node$arguments = _slicedToArray(node.arguments, 2),
            keyNode = _node$arguments[0],
            countNode = _node$arguments[1];

        var key = (0, _utils.getKeyValue)(keyNode);
        if (!key) {
          return;
        }

        if (typeof countNode === 'undefined') {
          langConfig.forEach(function (_ref2) {
            var name = _ref2.name,
                translation = _ref2.translation;

            if (!(0, _utils.has)(translation, key)) {
              context.report({ node: node, severity: 2, message: '\'' + key + '\' is missing from \'' + name + '\' language' });
            }
          });
        } else if (config.pluralizedKeys && config.pluralizedKeys.length) {
          langConfig.forEach(function (_ref3) {
            var name = _ref3.name,
                translation = _ref3.translation;

            var missingKeys = config.pluralizedKeys.reduce(function (accumulator, plural) {
              return (0, _utils.has)(translation, key + '.' + plural) ? accumulator : accumulator.concat(plural);
            }, []);
            if (missingKeys.length) {
              context.report({ node: node, message: '[' + missingKeys + '] keys are missing for key \'' + key + '\' in \'' + name + '\' language' });
            }
          });
        }
      }
    };
  };
};

module.exports.schema = [];