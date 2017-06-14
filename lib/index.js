'use strict';

module.exports = {
  rules: {
    'no-unknown-key': require('./rules/no-unknown-key')('principalLangs'),
    'no-unknown-key-secondary-langs': require('./rules/no-unknown-key')('secondaryLangs'),
    'no-text-as-children': require('./rules/no-text-as-children')
  }
};