/**
 * Created by KlimMalgin on 27.09.2014.
 *
 * Примесь содержит методы общего назначения в рамках библиотеки
 */
'use strict';


module.exports = {

    /**
     * Возвращает объект из источника
     * @param {Array} pathArray  массив содержащий путь до целевого элемента
     * @param {Object} source Объект-источник
     * @return {Number|Boolean|String}
     **/
    getter: function (pathArray, source) {
        var index = pathArray.shift();

        if (!pathArray.length) {
            return source[index];
        }
        return getter(pathArray, source[index]);
    },

    /**
     * Скопирует в прототип this все свойства объекта source
     * @param {Object} source объект с набором свойств для копирования
     **/
    mixin: function (source) {
        if (source) {
            for (var prop in source) {
                if (!source.hasOwnProperty(prop)) continue;
                this.prototype[prop] = source[prop];
            }
        }
    }

};
