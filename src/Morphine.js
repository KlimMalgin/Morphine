

// TODO: Сделать установку типа для коллекции

// TODO: Возможно стоит помечать текущий уровень объекта как 'Object' или 'Array'.
// TODO: Для каждого типа объекта проверять верно используются его API или нет. (Напрмер для Object нельзя использовать push/pop, а для Array - add/remove)
// TODO: Доработать билд объектов. На том уровне вложенности, где на пути билдера будет встречаться знак '$' или число - должен генерироваться массив и элементы должны добавляться соответственно через push.
// TODO: Merge сейчас работает некорректно. Если встречаются объекты с одинаковыми названиями, то старый объект заменяется новым без проверки вложенных свойств.
// TODO: Реализовать корректный метод stringify для коллекции
// TODO: Вынести билдер в отдельный файл
// TODO: Добавить тесты
// TODO: Добавить Gulp для сборки
// TODO: Оформить библиотеку как bower-пакет


function MorphineArray() {}
MorphineArray.prototype = new Array();

/**
 * constructor
 **/
function Morphine() {}

/**
 * Подключаем API массивов
 **/
/*Morphine.prototype.push = Array.prototype.push;
Morphine.prototype.pop = Array.prototype.pop;
Morphine.prototype.join = Array.prototype.join;
Morphine.prototype.splice = Array.prototype.splice;*/


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
                    }
                } else {
                    iter[props[i]] = (typeof iter[props[i]] !== 'undefined') ? iter[props[i]] : new MorphineArray();
                }
            } else {
                if (intRegexp.test(props[i])) {
                    if (typeof iter[props[i]] === 'undefined') {
                        // TODO: Неустоявшееся поведение: Если элемент еще не существует - ничего с ним не делаем, т.к. не ясно что с ним делать
                        console.info("TODO: Неустоявшееся поведение: Если элемент еще не существует - ничего с ним не делаем, т.к. не ясно что с ним делать");
                    } else {
                        // TODO: Неустоявшееся поведение: Если элемент уже существует - ничего с ним не делаем, т.к. не ясно что с ним делать
                        console.info("TODO: Неустоявшееся поведение: Если элемент уже существует - ничего с ним не делаем, т.к. не ясно что с ним делать");
                    }
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
            if (!dst[key]) { dst[key] = {}; }
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
        if (expect[i] === real) {
            return true;
        }
    }
    return false;
}

/**
 * Метод вернет целевой объект по указанному свойству
 * @param {String} property путь до целевого объекта
 **/
Morphine.prototype.get = function (property) {
    var property_array = property.split('.');
    return getter(property_array, this);
};

/**
 * Метод добавит элемент в текущий Morphine-объект
 * @param {String} key ключ нового элемента
 * @param {String} el элемент, который будет добавлен
 **/
Morphine.prototype.add = function (key, el) {
    this[key] = el;
};

/**
 * Метод удалит элемент из текущего Morphine-объекта
 * @param {String} key ключ удаляемого элемента
 **/
Morphine.prototype.remove = function (key) {
    delete this[key];
};

/**
 * Проверит наличие свойства key в текущем объекте
 * @param {String} key ключ элемента
 * @return {Boolean} Результат проверки присутствия поля. true - присутствует, false - отсутствует.
 **/
Morphine.prototype.has = function (key) {
    return this.hasOwnProperty(key);
};

/**
 * Проверит свойство объекта на undefined
 * @param {String} key ключ элемента
 * @return {Boolean} Результат проверки. true - свойство == undefined, false - свойство !== undefined.
 **/
Morphine.prototype.isUndefined = function (key) {
    return typeof this[key] === 'undefined';
};

/**
 * Проверит свойство объекта на null
 * @param {String} key ключ элемента
 * @return {Boolean} Результат проверки. true - свойство == null, false - свойство !== null.
 **/
Morphine.prototype.isNull = function (key) {
    return this[key] === null;
};

/**
 * Проверит принадлежность коллекции к типу объекта
 * @return {Boolean} Результат проверки. true - коллекция является объектом == null, false - коллекция не является объектом
 **/
/*Morphine.prototype.isObject = function () {
    return (this.isUndefined('__type__') || this.__type__ === "Object");
};*/

/**
 * Проверит принадлежность коллекции к типу массива
 * @return {Boolean} Результат проверки. true - коллекция является массивом == null, false - коллекция не является массивом
 **/
/*Morphine.prototype.isArray = function () {
    return this.__type__ === "Array";
};*/

/**
 * Метод выстроит объект по структуре указанной в path. В последний
 * элемент path поместит значение value.
 * @param {String} path Задает структуру объекта для построения
 * @param {Any} value Значение последнего элемента в path
 **/
Morphine.prototype.build = function (path, value) {
    var newObject = BuildObject.bind(this)(path, value);
    //MergeObjects.bind(this)(this, newObject);
    //return this;
    return newObject;
};
