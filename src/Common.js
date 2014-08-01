
/***
 * Класс общих методов для Morphine и MorphineArray
 * @constructor
 */
function Common() {};

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
 * @param {String} path Задает структуру объекта для построения
 * @param {*} value Значение последнего элемента в path
 **/
Common.prototype.build = function (path, value) {
    var newObject = BuildObject.bind(this)(path, value);
    //MergeObjects.bind(this)(this, newObject);
    //return this;
    return newObject;
};

/**
 * @param newObject объект который нужно смерджить с текущим
 * @returns {*}
 **/
Common.prototype.merge = function (newObject) {
    return MergeObjects.bind(this)(this, newObject);
};


Morphine.extend(Common.prototype);
MorphineArray.extend(Common.prototype);
