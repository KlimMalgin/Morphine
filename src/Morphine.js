

// TODO: Merge сейчас работает некорректно. Если встречаются объекты с одинаковыми названиями, то старый объект заменяется новым без проверки вложенных свойств.
// TODO: Реализовать корректный метод stringify для коллекции
// TODO: Если при создании Morphine-объекта ему в качестве параметра передается массив или объект - нужно преобразовать его в Morphine-сущность
// TODO: Вынести билдер в отдельный файл
// TODO: Добавить тесты
// TODO: Добавить Gulp для сборки
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

