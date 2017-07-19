const fs = require('fs');
const path = require('path');
const appRootPath = require('app-root-path');

const recursiveGet = (object, keys, index) => {
  if (keys.length - index === 1) {
    return object[keys[index]];
  }

  return object[keys[index]] ? recursiveGet(object[keys[index]], keys, index + 1) : undefined;
};

exports.has = (object, key) => !!recursiveGet(object, key.split('.'), 0);

exports.get = (object, key) => recursiveGet(object, key.split('.'), 0);

exports.getKeyValue = key => {
  if (key.type === 'Literal') {
    return key.value;
  } else if (key.type === 'TemplateLiteral' && key.quasis.length === 1) {
    return key.quasis[0].value.cooked;
  }

  return null;
};

const expireAt = {};
let langConfig;
exports.getLangConfig = (config, languagesKey) => {
  if (!expireAt[languagesKey] || expireAt[languagesKey] <= Date.now() || config.disableCache) {
    langConfig = config[languagesKey].map(({ name, translationPath }) => {
      try {
        const langFile = JSON.parse(fs.readFileSync(path.resolve(`${appRootPath}/${translationPath}`)).toString());

        return {
          name,
          translation: langFile,
        };
      } catch (e) {
        return {
          name,
          translation: null,
        };
      }
    });
    expireAt[languagesKey] = Date.now() + (config.translationsCacheTTL || 500);
  }

  return langConfig;
};
