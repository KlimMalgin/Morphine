

// TODO: Когда будет готов генератор path-ов нужно сделать билдер объекта из path-массива
// TODO: Для генераторов неализовать правила обработчики, которые в процессе построения объекта, либо генерации json/path-представления способны обрабатывать сериализуемые, либо компилируемые элементы в соответствии с зананным набором правил. Набор правил задается как набор функций, которые выполняются на текущем элементе последовательно.


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

