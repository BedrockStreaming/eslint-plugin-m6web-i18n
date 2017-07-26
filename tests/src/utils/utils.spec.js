const { getLangConfig, has, get } = require('../../../src/utils/utils');
const assert = require('assert');

describe('utils', () => {
  it('should get key', () => {
    const object = {
      foo: {
        bar: 'foobar',
      },
    };

    assert.equal(get(object, 'foo.bar'), 'foobar');
  });

  it('should has key', () => {
    const object = {
      foo: {
        bar: 'foobar',
      },
    };

    assert.ok(has(object, 'foo.bar'));
  });

  it('should getLangConfig', () => {
    const config = {
      foo: [
        { name: 'foo-en', translationPath: 'tests/i18n/en.json' },
        { name: 'foo-fr', translationPath: 'tests/i18n/fr.json' },
      ],
      bar: [{ name: 'bar-fr', translationPath: 'tests/i18n/fr.json' }],
      translationsCacheTTL: 500000,
    };

    const fooExpectation = [
      {
        name: 'foo-en',
        translation: {
          basic: 'Hello world !',
          pluralized: {
            one: 'All for one',
            other: 'None for the others',
          },
          interpolated: 'Hello %(name)s !',
        },
      },
      {
        name: 'foo-fr',
        translation: {
          basic: 'Salut le monde !',
          pluralized: {
            one: 'Tout pour moi',
            other: 'Rien pour les autres',
          },
          interpolated: 'Salut %(name)s !',
        },
      },
    ];
    const barExpectation = [
      {
        name: 'bar-fr',
        translation: {
          basic: 'Salut le monde !',
          pluralized: {
            one: 'Tout pour moi',
            other: 'Rien pour les autres',
          },
          interpolated: 'Salut %(name)s !',
        },
      },
    ];

    let langConfig = getLangConfig(config, 'foo');
    assert.deepEqual(langConfig, fooExpectation);

    langConfig = getLangConfig(config, 'bar');
    assert.deepEqual(langConfig, barExpectation);

    langConfig = getLangConfig(config, 'foo');
    assert.deepEqual(langConfig, fooExpectation);

    langConfig = getLangConfig(config, 'bar');
    assert.deepEqual(langConfig, barExpectation);
  });
});
