# eslint-plugin-m6web-i18n

This is an [eslint](http://eslint.org/) plugin for i18n in a [react](https://facebook.github.io/react/) application.

## Installation

``` shell
yarn add -D eslint-plugin-m6web-i18n
```

## Rules

 * i18n/no-unknown-key: Verify that there all translation key you use are present in your primary translation files.
 * i18n/no-unknown-key-secondary-langs: Same as the previous one. Allow you to have a different error level for secondary languages.
 * i18n/no-text-as-children: Verify that you have no text children in your react code.
 
## Config

You have to add the following lines in your `.eslintrc` file to configure this plugin:

```js
  // Declare the plugin
  "plugins": [
    "i18n"
  ],
  // Specify rules severity
  "rules": {
    "i18n/no-unknown-key": "error",
    "i18n/no-unknown-key-secondary-langs": "warn",
    "i18n/no-text-as-children": "error"
  },
  // The plugin needs jsx feature to be on for 'no-text-as-children' rule
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  },
  // Settings of your translation
  "settings": {
    "i18n": {
      // Your principal languages used in 'no-unknown-key' rule
      "principalLangs": [
        {
          "name": "fr",
          "translationPath": "i18n/fr.json"
        }
      ],
      // Secondary languages used in 'no-unknown-key-secondary-langs' rule
      "secondaryLangs": [
        {
          "name": "en",
          "translationPath": "i18n/en.json"
        }
      ],
      // Name of your translate function
      "functionName": "t",
      // If you want to ignore specific files
      "ignoreFiles": "spec.js",
      // If you have pluralization
      "pluralizedKeys": ["one", "other"]
    }
  }
```
