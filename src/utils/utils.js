const _has = (object, keys, index) => {
  if (keys.length - index === 1) {
    return !!object[keys[index]];
  }

  return object[keys[index]] ? _has(object[keys[index]], keys, index + 1) : false;
};

export const has = (object, key) => _has(object, key.split('.'), 0);

export const getKeyValue = key => {
  if (key.type === 'Literal') {
    return key.value;
  } else if (key.type === 'TemplateLiteral' && key.quasis.length === 1) {
    return key.quasis[0].value.cooked;
  }

  return null;
};
