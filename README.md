[![Build Status](https://travis-ci.org/KlimMalgin/Morphine.svg?branch=master)](https://travis-ci.org/KlimMalgin/Morphine)
[![Coverage Status](https://coveralls.io/repos/KlimMalgin/Morphine/badge.png)](https://coveralls.io/r/KlimMalgin/Morphine)


# Morphine
Extended JavaScript collections

### API

> config({Object} options) 

Сконфигурирует morphine в текущей сессии. Сейчас доступна только одна опция separator, которая хранит символ-разделитель для парсинга и генерации path.  
**return** Текущий объект

> isObject() 

Проверяет, является ли текущая сущность Morphine-объектом  
**return** true|false

> isArray() 

Проверяет, является ли текущая сущность Morphine-коллекцией  
**return** true|false

> isNull({String} key) 

Проверит свойство key текущего объекта на null  
**return** true|false

> isUndefined({String} key) 

Проверит, является ли свойство key - undefined  
**return** true|false

> isEmpty() 

Проверит - является ли текущий объект пустым  
**return** true|false

> has({String} path) 

Проверит наличие свойства path в текущем объекте или структуры соответствующей пути указанном в path  
**return** true|false

> merge({Object} src) 

Выполнит merge src c текущим объектом  
**return** Текущий объект, дополненный структурой из src

> set({String} path, {Any} value)  
> set({String} path) 

Установит свойство по указанному path. Value может быть любого типа и является опциональным. Если value не указано, то по пути path будет создан пустой объект.  
**return** Текущий объект, дополненный структурой path: value

> get({String} path) 

Вернет значение по указанному path  
**return** Значение по указанному path

> stringify() 

Сериализует Morphine-объект в строку  
**return** JSON-строка, представляющая текущий объект

> plain() 

Преобразует Morphine-объект в plain-объект  
**return** plain-объект от текущего объекта

> toPaths() 

Преобразует текущий экземпляр объекта в массив path-элементов  
**return** Массив path-элементов, соответствующий структуре текущего объекта

> remove({String} path) 

Удалит вложенный объект или значение по указанному path  
**return** Текущий объект с удаленной path-ветвью

> clear() 

Очистит текущий экземпляр объекта  
**return** Пустой morphine-объект

> buildFromPaths({Array} paths) 

Преобразует текущий экземпляр объекта в объект описаный переданным массивом path-элементов.  
**return** Текущий объект

---
### Examples

Build example:
```js
q = new Morphine();
q.set('base.firstField.collection.$.field', 'It\'s field value');
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
