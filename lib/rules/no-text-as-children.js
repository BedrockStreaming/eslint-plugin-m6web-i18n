'use strict';

module.exports = function (context) {
  var config = context.settings.i18n;

  if (config.ignoreFiles && new RegExp(config.ignoreFiles).test(context.getFilename())) {
    return {};
  }

  return {
    JSXElement: function JSXElement(node) {
      node.children.forEach(function (child) {
        if (child.type === 'Literal') {
          var text = child.raw.trim().replace('\\n', '');
          if (text.length) {
            context.report({ node: child, message: 'Untranslated text \'' + text + '\'' });
          }
        }
      });
    }
  };
};

module.exports.schema = [];