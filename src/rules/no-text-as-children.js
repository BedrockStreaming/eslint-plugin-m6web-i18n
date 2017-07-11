const minimatch = require('minimatch');

module.exports = {
  meta: {
    docs: {
      description: 'ensures that no plain text is used in JSX components',
      category: 'Possible errors',
    },
    schema: [],
  },
  create(context) {
    const config = context.settings.i18n;

    if (config && config.ignoreFiles && minimatch(context.getFilename(), config.ignoreFiles)) {
      return {};
    }

    return {
      JSXElement(node) {
        node.children.forEach(child => {
          if (child.type === 'Literal') {
            const text = child.raw.trim().replace('\\n', '');
            if (text.length) {
              context.report({ node: child, message: `Untranslated text '${text}'` });
            }
          }
        });
      },
    };
  },
};
