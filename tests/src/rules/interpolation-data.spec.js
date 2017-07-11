const RuleTester = require('eslint/lib/testers/rule-tester');
const rule = require('../../../src/rules/interpolation-data');

const ruleTester = new RuleTester();

const settings = {
  i18n: {
    disableCache: true,
    functionName: 't',
    principalLangs: [
      {
        name: 'en',
        translationPath: 'tests/i18n/en.json',
      },
    ],
  },
};

const options = [
  {
    interpolationPattern: '%\\(.+\\)[sd]',
  },
];

ruleTester.run('m6web-i18n/interpolation-data', rule, {
  valid: [{ code: 't("basic")', settings, options }, { code: 't("interpolated", data)', settings, options }],
  invalid: [
    {
      code: 't("basic", data)',
      settings,
      options,
      errors: [
        {
          message: "'basic' doesn't require any interpolation data.",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 't("interpolated")',
      settings,
      options,
      errors: [
        {
          message: "'interpolated' requires interpolation data.",
          type: 'CallExpression',
        },
      ],
    },
  ],
});
