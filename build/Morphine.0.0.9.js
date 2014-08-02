
var Morphine = (function (factory) {
    return factory();
})(function () {



/***
 * @constructor
 */
function MorphineArray() { this.constructor = MorphineArray; }
MorphineArray.prototype = new Array();
MorphineArray.prototype = new MorphineArray();

/***
 * @constructor
 */
function Morphine(obj) {
    if (obj) {
        this.build(obj);
    }
}

Morphine.extend = MorphineArray.extend = function(source) {
    if (source) {
        for (var prop in source) {
            this.prototype[prop] = source[prop];
        }
    }
};

/**
 * Возвращает объект из источника
 * @param {Array} pathArray  массив содержащий путь до целевого элемента
 * @param {Object} source Объект-источник
 **/
function getter (pathArray, source) {
    var index = pathArray.shift();

    if (!pathArray.length) {
        return source[index];
    }
    return getter(pathArray, source[index]);
}




/**
 * @private
 * Метод выстроит объект по структуре указанной в path
 * @param {String} path Задает структуру объекта для построения
 * @param {Any} value Значение последнего элемента в path
 **/
function BuildObject (path, value) {
    var props = path.split('.'),
        iter = this, base = iter,
        intRegexp = /^[0-9]$/;

    for (var i = 0; i < props.length; i++) {
        if (typeof iter === 'undefined') break;

        if (i == (props.length-1)) {
            if (props[i] === '$') {
                iter.push(value);
            } else if (intRegexp.test(props[i])) {
                if (typeof iter[props[i]] === 'undefined') {
                    console.error("Элемент %o не существует", props.slice(0, i+1).join('.'));
                }
            } else {
                iter[props[i]] = value;
            }
        } else {
            if (intRegexp.test(props[i+1]) || props[i+1] === '$') {
                // Если следующий элемент - число или текущий обозначен как коллекция, то на текущем уровне нужно создать массив
                if (props[i] === '$') {
                    iter.push(new MorphineArray());
                } else if (intRegexp.test(props[i])) {
                    if (typeof iter[props[i]] === 'undefined') {
                        console.error("Элемент %o не существует", props.slice(0, i+1).join('.'));
                    } else {
                        // TODO: Если элемент существует ничего не делаем, т.к. нужно продолжить работу с текущим элементом
                    }
                } else {
                    iter[props[i]] = (typeof iter[props[i]] !== 'undefined') ? iter[props[i]] : new MorphineArray();
                }
            } else {
                if (intRegexp.test(props[i])) {
                    /*if (typeof iter[props[i]] === 'undefined') {
                        // TODO: Неустоявшееся поведение: Если элемент еще не существует - ничего с ним не делаем, т.к. не ясно что с ним делать
                        console.info("TODO: Неустоявшееся поведение: Если элемент еще не существует - ничего с ним не делаем, т.к. не ясно что с ним делать");
                    } else {
                        // TODO: Resolve Неустоявшееся поведение: Если элемент уже существует - ничего с ним не делаем, т.к. нужно продолжить работу с существующим элементом
                        console.info("TODO: Resolve Неустоявшееся поведение: Если элемент уже существует - ничего с ним не делаем, т.к. нужно продолжить работу с существующим элементом");
                    }*/
                    iter[props[i]] = (typeof iter[props[i]] !== 'undefined') ? iter[props[i]] : new Morphine();
                } else if (props[i] === '$') {
                    iter.push(new Morphine());
                } else {
                    iter[props[i]] = (typeof iter[props[i]] !== 'undefined') ? iter[props[i]] : new Morphine();
                }
            }

            if (props[i] === '$') {
                iter = iter[iter.length-1];
            } else {
                iter = iter[props[i]];
            }
        }
    }
    return base;
}


/**
 * @private
 * Мерджит поля объекта dst с полями объекта src,
 * если они являются примитивными типами.
 * @param {Morphine} dst Целевой объект для мерджа
 * @param {Morphine} src Исходный объект для мерджа
 */
function MergeObjects (dst, src) {
    for (var key in src) {
        if (!src.has(key) || src.isUndefined(key) || src.isNull(key)) continue;

        if (checkType(src[key].constructor)) {
            dst[key] = src[key];
        } else {
            if (dst && !dst.has(key)) {
                if (src[key].isArray()) {
                    dst[key] = new MorphineArray();
                } else if (src[key].isObject()) {
                    dst[key] = new Morphine();
                }
            }
            MergeObjects(dst[key], src[key]);
        }
    }
    return dst;
}

/**
 * @private
 * Проверяет соответствие фактического типа real примитивным типам.
 * Если задан ожидаемый тип expect, то проверяется соответствие только с ним.
 */
function checkType (real, expect) {
    expect = expect ? [expect] : [Boolean, String, Number];
    var ln = expect.length;
    for (var i = 0; i < ln; i++) {
        if (expect[i] === real || expect[i] === real.constructor) {
            return true;
        }
    }
    return false;
}


function stringify() {
    var currentString = "";
    if (this.isObject()) {
        currentString = ObjectToString(this);
    } else if (this.isArray()) {
        currentString = ArrayToString(this);
    }
    return currentString;
}

function ObjectToString (obj) {
    var start = "{", end = "}",
        result = [], item = "";
    for (var key in obj) {
        if (!obj.has(key)) continue;
        item += "\"" + key + "\":";
        if (obj[key].isObject && obj[key].isObject()) {
            item += ObjectToString(obj[key]);
        } else
        // TODO: Bug. Метод isArray() не доступен в прототипе.
        if ((obj[key].isArray && obj[key].isArray()) || obj[key].constructor === Array) {
            item += ArrayToString(obj[key]);
        } else
        if (checkType(obj[key])) {
            if (checkType(obj[key], String)) {
                item += "\"" + obj[key] + "\"";
            } else {
                item += obj[key];
            }
        } else
        if (checkType(obj[key], Object) || checkType(obj[key], Array)) {
            item += JSON.stringify(obj[key]);
        }
        result.push(item);item = "";
    }
    return start + result.join(',') + end;
}

function ArrayToString (obj) {
    var start = "[", end = "]",
        result = [], item = "",
        ln = obj.length;
    for (var key = 0; key < ln; key++) {
        if (!obj.has(key) || key === 'length') continue;
        if (obj[key].isObject && obj[key].isObject()) {
            item += ObjectToString(obj[key]);
        } else
        if (obj[key].isArray && obj[key].isArray()) {
            item += ArrayToString(obj[key]);
        } else
        if (checkType(obj[key])) {
            item += obj[key];
        } else
        if (checkType(obj[key], Object) || checkType(obj[key], Array)) {
            item += JSON.stringify(obj[key]);
        }
        result.push(item);item = "";
    }
    return start + result.join(',') + end;
}


function converter (obj) {
    var morph = this;
    if (obj.constructor === Object) {
        ConvertObject(obj, morph);
    } else if (obj.constructor === Array) {
        ConvertArray(obj, morph);
    }
    return morph;
}

function ConvertObject (obj, morph) {
    var morph = morph || new Morphine();
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        if (obj[key].constructor === Object) {
            //morph.set(key, new Morphine());
            morph.set(key, ConvertObject(obj[key]));
        } else
        if (obj[key].constructor === Array) {
            morph.set(key, ConvertArray(obj[key]));
        } else
        if (obj[key].constructor === String || obj[key].constructor === Boolean || obj[key].constructor === Number) {
            morph.set(key, obj[key]);
        } else {
            console.error("Конструктор не определен %o %o %o", obj, key, obj[key]);
        }
    }
    return morph;
}

function ConvertArray (obj, morph) {
    var morph = morph || new MorphineArray(),
        ln = obj.length;

    for (var key = 0; key < ln; key++) {
        if (obj[key].constructor === Object) {
            morph.push(ConvertObject(obj[key]));
        } else
        if (obj[key].constructor === Array) {
            morph.push(ConvertArray(obj[key]));
        } else
        if (obj[key].constructor === String || obj[key].constructor === Boolean || obj[key].constructor === Number) {
            morph.push(obj[key]);
        } else {
            console.error("Конструктор не определен %o %o %o", obj, key, obj[key]);
        }
    }
    return morph;
}


/***
 * Класс общих методов для Morphine и MorphineArray
 * @constructor
 */
function Common() {}

/***
 *
 * @param key
 * @returns {boolean}
 */
Common.prototype.create = function (obj) {
    if (obj) {
        this.build(obj);
    }
    return this;
};

/**
 * Проверит наличие свойства key в текущем объекте
 * @param {String} key ключ элемента
 * @return {Boolean} Результат проверки присутствия поля. true - присутствует, false - отсутствует.
 **/
Common.prototype.has = function (key) {
    return this.hasOwnProperty(key);
};

/**
 * Проверит свойство объекта на undefined
 * @param {String} key ключ элемента
 * @return {Boolean} Результат проверки. true - свойство == undefined, false - свойство !== undefined.
 **/
Common.prototype.isUndefined = function (key) {
    return typeof this[key] === 'undefined';
};

/**
 * Проверит свойство объекта на null
 * @param {String} key ключ элемента
 * @return {Boolean} Результат проверки. true - свойство == null, false - свойство !== null.
 **/
Common.prototype.isNull = function (key) {
    return this[key] === null;
};

/**
 * Проверит принадлежность коллекции к типу объекта
 * @return {Boolean} Результат проверки. true - коллекция является объектом == null, false - коллекция не является объектом
 **/
Common.prototype.isObject = function () {
    return this.constructor === Morphine;   // (this.isUndefined('__type__') || this.__type__ === "Object");
};

/**
 * Проверит принадлежность коллекции к типу массива
 * @return {Boolean} Результат проверки. true - коллекция является массивом == null, false - коллекция не является массивом
 **/
Common.prototype.isArray = function () {  // TODO: Не доступен для MorphineArray
    return this.constructor === MorphineArray;  //this.__type__ === "Array";
};

/**
 * Метод вернет целевой объект по указанному свойству
 * @param {String} property путь до целевого объекта
 **/
Common.prototype.get = function (property) {
    var property_array = property.split('.');
    return getter(property_array, this);
};

/**
 * Метод установит значение по указанному path. Если path или его часть
 * не существует, то недостающие элементы будут выстроены в соответствии
 * со структурой path.
 * @param {String} path Задает элемент для установки значения
 * @param {*} value Значение последнего элемента в path. По умолчанию - пустой объект
 * @return {Morphine} Получившийся объект
 **/
Common.prototype.set = function (path, value) {
    BuildObject.bind(this)(path, (typeof value !== 'undefined') ? value : {});
    return this;
};

/**
 * Метод добавит элемент в текущий Morphine-объект
 * @param {String} key ключ нового элемента
 * @param {String} el элемент, который будет добавлен
 **/
Common.prototype.add = function (key, el) {
    this[key] = el;
};

/**
 * Метод удалит элемент из текущего Morphine-объекта
 * @param {String} key ключ удаляемого элемента
 **/
Common.prototype.remove = function (key) {
    delete this[key];
};

/**
 * Метод выстроит объект по структуре указанной в path. В последний
 * элемент path поместит значение value.
 * @param {String} obj Объект для преобразования
 **/
Common.prototype.build = function (obj) {
    converter.bind(this)(obj || {});
    return this;
};

/**
 * @param newObject объект который нужно смерджить с текущим
 * @returns {*}
 **/
Common.prototype.merge = function (newObject) {
    return MergeObjects.bind(this)(this, newObject);
};

/***
 * Вернет строковое представление объекта
 * @returns {String}
 */
Common.prototype.stringify = function () {
    return stringify.bind(this)();
};

/***
 * Преобразует Morphine-объект в нативный JavaScript-объект
 * @returns {*}
 */
Common.prototype.toJSON = function () {
    return JSON.parse(stringify.bind(this)());
};

Morphine.extend(Common.prototype);
MorphineArray.extend(Common.prototype);


return Morphine;
});
