[![Build Status](https://travis-ci.org/KlimMalgin/Morphine.svg?branch=master)](https://travis-ci.org/KlimMalgin/Morphine)


# Morphine
Extended JavaScript collections

### API

> {Morphine} config({Object} options) 

Сконфигурирует morphine в текущей сессии. Сейчас доступна только одна опция separator, которая хранит символ-разделитель для парсинга и генерации path.  
**return** Текущий объект

> {Boolean} isObject() 

Проверяет, является ли текущая сущность Morphine-объектом  
**return** true|false

> {Boolean} isArray() 

Проверяет, является ли текущая сущность Morphine-коллекцией  
**return** true|false

> {Boolean} isNull({String} key) 

Проверит свойство key текущего объекта на null  
**return** true|false

> {Boolean} isUndefined({String} key) 

Проверит, является ли свойство key - undefined  
**return** true|false

> {Boolean} isEmpty() 

Проверит - является ли текущий объект пустым  
**return** true|false

> {Boolean} has({String} path) 

Проверит наличие свойства path в текущем объекте или структуры соответствующей пути указанном в path  
**return** true|false

> {Morphine} merge({Object} src) 

Выполнит merge src c текущим объектом  
**return** Текущий объект, дополненный структурой из src

> {Morphine} set({String} path, {Any} value)  
> {Morphine} set({String} path) 

Установит свойство по указанному path. Value может быть любого типа и является опциональным. Если value не указано, то по пути path будет создан пустой объект.  
**return** Текущий объект, дополненный структурой path: value

> {Any} get({String} path) 

Вернет значение по указанному path  
**return** Значение по указанному path

> {String} stringify() 

Сериализует Morphine-объект в строку  
**return** JSON-строка, представляющая текущий объект

> {Object} plain() 

Преобразует Morphine-объект в plain-объект  
**return** plain-объект от текущего объекта

> {Array} toPaths() 

Преобразует текущий экземпляр объекта в массив path-элементов  
**return** Массив path-элементов, соответствующий структуре текущего объекта

> {Morphine} remove({String} path) 

Удалит вложенный объект или значение по указанному path  
**return** Текущий объект с удаленной path-ветвью

> {Morphine} clear() 

Очистит текущий экземпляр объекта  
**return** Пустой morphine-объект

> {Morphine} buildFromPaths({Array} paths)   

[not stable]  
Преобразует текущий экземпляр объекта в объект описаный переданным массивом path-элементов.  
**return** Текущий объект

---
# Examples

#### Create Morphine:  

```js
// Path only:
var m = new Morphine('App.Collections.Users.$');
// result:
{
    "App":{
        "Collections":{
            "Users":[]
        }
    }
}

// Path:object
var m = new Morphine('App.SessionData', {
    userName: 'Max',
    age: 22,
    phone: '+1(234)567890'
});
// result:
{
    "App":{
        "SessionData":{
            "userName":"Max",
            "age":22,
            "phone":"+1(234)567890"
        }
    }
}

// Only object
var m = new Morphine({
    userName: 'Max',
    age: 22,
    phone: '+1(234)567890'
});
// result:
{
    "userName":"Max",
    "age":22,
    "phone":"+1(234)567890"
}

// Empty
var m = new Morphine();
// result:
{}
```
