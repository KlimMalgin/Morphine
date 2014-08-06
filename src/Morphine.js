

/***
 * @constructor
 */
function MorphineArray() { /*this.constructor = MorphineArray;*/ }
MorphineArray.prototype = new Array();
MorphineArray.prototype = new MorphineArray();
MorphineArray.prototype.constructor = MorphineArray;

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

