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

const options = [
  {
    ignorePattern: '^\\s?[/.]\\s?$',
  },
];

ruleTester.run('m6web-i18n/no-text-as-children', rule, {
  valid: [
    { code: '<span>{t("basic")}</span>', parserOptions, settings },
    { code: '<span> / </span>', parserOptions, settings, options },
    { code: '<div><span>{t("basic")}</span>.</div>', parserOptions, settings, options },
  ],
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
    {
      code: '<span>{t("basic")}a.</span>',
      parserOptions,
      settings,
      options,
      errors: [
        {
          message: "Untranslated text 'a.'",
          type: 'Literal',
        },
      ],
    },
  ],
});
