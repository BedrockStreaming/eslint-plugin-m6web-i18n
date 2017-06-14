module.exports = context => {
  const config = context.settings.i18n;

  if (config.ignoreFiles && new RegExp(config.ignoreFiles).test(context.getFilename())) {
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
};

module.exports.schema = [];
