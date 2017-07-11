const noUnknownKey = require('./rules/no-unknown-key');
const noTextAsChildren = require('./rules/no-text-as-children');
const interpolationData = require('./rules/interpolation-data');

module.exports = {
  rules: {
    'no-unknown-key': noUnknownKey('principalLangs'),
    'no-unknown-key-secondary-langs': noUnknownKey('secondaryLangs'),
    'no-text-as-children': noTextAsChildren,
    'interpolation-data': interpolationData,
  },
};
