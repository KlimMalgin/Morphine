

// TODO: Если при создании Morphine-объекта ему в качестве параметра передается массив или объект - нужно преобразовать его в Morphine-сущность
// TODO: Добавить тесты
// TODO: Добавить метод create
// TODO: Добавить метод config
// TODO: Добавить цепочечный паттерн
// TODO: Реализовать форматированный вывод объекта в консоль
// TODO: Для build-сценария реализованы не все варианты
// TODO: Оформить библиотеку как bower-пакет
// TODO: Реализовать listeners на Morphine-объектах

/***
 * @constructor
 */
function MorphineArray() {};
MorphineArray.prototype = new Array();

/***
 * @constructor
 */
function Morphine() {};

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

