const RuleTester = require('eslint/lib/testers/rule-tester');
const rule = require('../../../src/rules/no-text-as-children');

const ruleTester = new RuleTester();

const parserOptions = {
  ecmaFeatures: {
    jsx: true,
  },
};

const settings = {
  disableCache: true,
};

ruleTester.run('m6web-i18n/no-text-as-children', rule, {
  valid: [{ code: '<span>{t("basic")}</span>', parserOptions, settings }],
  invalid: [
    {
      code: '<span>Hello world !</span>',
      parserOptions,
      settings,
      errors: [
        {
          message: "Untranslated text 'Hello world !'",
          type: 'Literal',
        },
      ],
    },
  ],
});
