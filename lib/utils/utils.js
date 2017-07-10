'use strict';

var fs = require('fs');
var path = require('path');
var appRootPath = require('app-root-path');

var recursiveGet = function recursiveGet(object, keys, index) {
  if (keys.length - index === 1) {
    return object[keys[index]];
  }

  return object[keys[index]] ? recursiveGet(object[keys[index]], keys, index + 1) : undefined;
};

exports.has = function (object, key) {
  return !!recursiveGet(object, key.split('.'), 0);
};

exports.get = function (object, key) {
  return recursiveGet(object, key.split('.'), 0);
};

exports.getKeyValue = function (key) {
  if (key.type === 'Literal') {
    return key.value;
  } else if (key.type === 'TemplateLiteral' && key.quasis.length === 1) {
    return key.quasis[0].value.cooked;
  }

  return null;
};

var langConfig = void 0;
var expireAt = 0;
exports.getLangConfig = function (config, languagesKey) {
  if (expireAt <= Date.now() || config.disableCache) {
    langConfig = config[languagesKey].map(function (_ref) {
      var name = _ref.name,
          translationPath = _ref.translationPath;

      try {
        var langFile = JSON.parse(fs.readFileSync(path.resolve(appRootPath + '/' + translationPath)).toString());

        return {
          name: name,
          translation: langFile
        };
      } catch (e) {
        return {
          name: name,
          translation: null
        };
      }
    });
    expireAt = Date.now() + (config.translationsCacheTTL || 500);
  }

  return langConfig;
};