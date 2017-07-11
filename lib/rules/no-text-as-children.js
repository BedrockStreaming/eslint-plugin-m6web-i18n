'use strict';

var minimatch = require('minimatch');

module.exports = {
  meta: {
    docs: {
      description: 'ensures that no plain text is used in JSX components',
      category: 'Possible errors'
    },
    schema: []
  },
  create: function create(context) {
    var config = context.settings.i18n;

    if (config && config.ignoreFiles && minimatch(context.getFilename(), config.ignoreFiles)) {
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
  }
};