
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

/***
 * Проверит является ли текущий объект пустым
 * @returns {boolean}
 */
Common.prototype.isEmpty = function () {
    for (var key in this) {
        if (this.has(key)) return false;
    }
    return true;
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
    return this.constructor === Morphine;
};

/**
 * Проверит принадлежность коллекции к типу массива
 * @return {Boolean} Результат проверки. true - коллекция является массивом == null, false - коллекция не является массивом
 **/
Common.prototype.isArray = function () {
    return this.constructor === MorphineArray;
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
    var valToSet = (typeof value !== 'undefined') ? value : {},
        checkResult = checkType(valToSet),
        mObject = null;

    if (!checkResult) {
        if (checkType(valToSet, Object)) {
            mObject = new Morphine();
        } else
        if (checkType(valToSet, Array)) {
            mObject = new MorphineArray();
        } else
        if (checkType(valToSet, Morphine) || checkType(valToSet, MorphineArray)) {
            checkResult = true;
        }
    }

    BuildObject.bind(this)(path, checkResult ? valToSet : converter.bind(mObject)(valToSet));
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

/***
 * Сериализует объект в набор path-значений
 * @returns {Array}
 */
Common.prototype.toPaths = function () {
    return PathGenerator.bind(this)();
};

Morphine.extend(Common.prototype);
MorphineArray.extend(Common.prototype);
