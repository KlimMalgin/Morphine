
/**
 * constructor
 **/
function Morphine() {
    return this;
}

/**
 * Подключаем API массивов
 **/
Morphine.prototype.push = Array.prototype.push;
Morphine.prototype.pop = Array.prototype.pop;
Morphine.prototype.join = Array.prototype.join;
Morphine.prototype.splice = Array.prototype.splice;

/**
 * Возвращает объект из источника
 * @param pathArray {Array} массив содержащий путь до целевого элемента
 * @param source {Object} Объект-источник
 **/
function getter (pathArray, source) {
    var index = pathArray.shift();

    if (!pathArray.length) {
        return source[index];
    }
    return getter(pathArray, source[index]);
};

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
 * Метод выстроит объект по структуре указанной в path
 * @param {String} path Задает структуру объекта для построения
 * @param {Any} value Значение последнего элемента в path
 **/
Morphine.prototype.build = function (path, value) {
    var props = path.split('.'),
        valueItemName = props[props.length-1],
        iter = this, base = iter;

    for (var i = 0; i < props.length; i++) {
        if (i == (props.length-1)) {
            iter[props[i]] = value;
        } else {
            iter[props[i]] = new Morphine();
            iter = iter[props[i]];
        }
    }
    return base;
};
