[![Build Status](https://travis-ci.org/KlimMalgin/Morphine.svg?branch=master)](https://travis-ci.org/KlimMalgin/Morphine)

Morphine
========

Extended JavaScript collections


Build example:
```js
q = new Morphine();
q.build('base.firstField.collection.$.field', 'It\'s field value');
```

Result:
```js
Morphine {…}
    base: Morphine
        firstField: Morphine
            collection: MorphineArray[1]
                0: Morphine
                    field: "It's field value"
                    __proto__: Morphine
                length: 1
            __proto__: Array[0]
        __proto__: Morphine
    __proto__: Morphine
__proto__: Morphine
```