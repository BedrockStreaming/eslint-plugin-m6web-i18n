'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _has = function _has(object, keys, index) {
  if (keys.length - index === 1) {
    return !!object[keys[index]];
  }

  return object[keys[index]] ? _has(object[keys[index]], keys, index + 1) : false;
};

var has = exports.has = function has(object, key) {
  return _has(object, key.split('.'), 0);
};

var getKeyValue = exports.getKeyValue = function getKeyValue(key) {
  if (key.type === 'Literal') {
    return key.value;
  } else if (key.type === 'TemplateLiteral' && key.quasis.length === 1) {
    return key.quasis[0].value.cooked;
  }

  return null;
};