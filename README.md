# eslint-plugin-m6web-i18n

This is an [eslint](http://eslint.org/) plugin for i18n in a [react](https://facebook.github.io/react/) application.

## Installation

``` shell
yarn add -D eslint-plugin-m6web-i18n
```

## Build

``` shell
yarn build
```

## Bump

To bump we use [mvrsion](https://www.npmjs.com/package/mversion).

example:
```shell
yarn mversion -- patch -m
```


## Rules

 * **i18n/no-unknown-key**: Verify that all translation keys you use are present in your primary translation files.
 * **i18n/no-unknown-key-secondary-langs**: Same as the previous one. Allow you to have a different error level for secondary languages.
 * **i18n/no-text-as-children**: Verify that you have no text children in your react code.
 * **i18n/no-text-as-attribute**: Verify that you have no text in some attributes in your react components. List of attributes as to be provided in the config.
 * **i18n/interpolation-data**: Checks for usage of keys containing string interpolation, if translate function is called without
 interpolation data it will show an error. Also if interpolation data is given and key doesn't contain interpolation it will also
 show an error. `interpolationPattern` option is required to match interpolation in your translation file.
 
## Config

You have to add the following lines in your `.eslintrc` file to configure this plugin:

```js
  // Declare the plugin
  "plugins": [
    "m6web-i18n"
  ],
  // Specify rules severity
  "rules": {
    "m6web-i18n/no-unknown-key": "error",
    "m6web-i18n/no-unknown-key-secondary-langs": "warn",
    "m6web-i18n/no-text-as-children": ["error", {"ignorePattern": "^\\s?[/.]\\s?$"}],
    "m6web-i18n/no-text-as-attribute": ["error", {"attributes": ["alt", "title"]}],
    "m6web-i18n/interpolation-data": ["error", { "interpolationPattern": "\\{\\.+\\}" }]
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
      "ignoreFiles": "**/*.spec.js",
      // If you have pluralization
      "pluralizedKeys": ["one", "other"],
      // TTL of the translations file caching (defaults to 500ms)
      "translationsCacheTTL": 300
    }
  }
```
