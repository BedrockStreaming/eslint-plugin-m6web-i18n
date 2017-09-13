const RuleTester = require('eslint/lib/testers/rule-tester');
const rule = require('../../../src/rules/no-text-as-attribute');

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
    attributes: ['alt', 'placeholder'],
  },
];

ruleTester.run('m6web-i18n/no-text-as-attribute', rule, {
  valid: [
    { code: '<div>{t("basic")}</div>', parserOptions, settings, options },
    {
      code: '<div alt={t("foo.bar")}>{t("basic")}</div>',
      parserOptions,
      settings,
      options,
    },
    {
      code: '<div alt={t("foo.bar")} title="foo bar">{t("basic")}</div>',
      parserOptions,
      settings,
      options,
    },
    {
      code: '<div alt={t("foo.bar")} title="foo bar" placeholder={variable}>{t("basic")}</div>',
      parserOptions,
      settings,
      options,
    },
  ],
  invalid: [
    {
      code: '<div alt="foo">{t("basic")}</div>',
      parserOptions,
      settings,
      options,
      errors: [
        {
          message: 'Untranslated JSX attribute alt with "foo"',
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: '<div alt="foo" title="foo bar">{t("basic")}</div>',
      parserOptions,
      settings,
      options,
      errors: [
        {
          message: 'Untranslated JSX attribute alt with "foo"',
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: '<div alt="foo" title="foo bar" placeholder={variable}>{t("basic")}</div>',
      parserOptions,
      settings,
      options,
      errors: [
        {
          message: 'Untranslated JSX attribute alt with "foo"',
          type: 'JSXAttribute',
        },
      ],
    },
  ],
});
