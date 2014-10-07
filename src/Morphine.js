'use strict';

(function (root, factory) {
    // Backbone-style settings
    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            root.Morphine = factory(root/*, exports*/);
        });
    } else if (typeof module !== 'undefined') {
        module.exports = factory(root/*, exports*/);
    } else {
        root.Morphine = factory(root/*, {}*/);
    }
}(this, function (root) {
    //Morphine.VERSION = '0.8.0';

    function Morphine(obj) {
        if (obj) {
            BuildObject.call(this, obj);
        }
    }

    function MorphineArray() {
    }

    MorphineArray.prototype = new Array();
    MorphineArray.prototype = new MorphineArray();
    MorphineArray.prototype.constructor = MorphineArray;

    Morphine.prototype.version = '0.0.9';


    /**
     * @private
     * Метод выстроит объект по структуре указанной в path
     * @param {String} path Задает структуру объекта для построения
     * @param {*} value Значение последнего элемента в path
     **/
    function BuildObject(path, value) {
        var props = path.split('.'),
            iter = this, base = iter,
            intRegexp = /^[0-9]$/;

        for (var i = 0; i < props.length; i++) {
            if (typeof iter === 'undefined') break;

            if (i == (props.length - 1)) {
                if (props[i] === '$') {
                    iter.push(value);
                } else if (intRegexp.test(props[i])) {
                    if (typeof iter[props[i]] === 'undefined') {
                        // TODO: Заменить все console-выводы на исключения
                        console.error("Элемент %o не существует", props.slice(0, i + 1).join('.'));
                    }
                } else {
                    iter[props[i]] = value;
                }
            } else {
                if (intRegexp.test(props[i + 1]) || props[i + 1] === '$') {
                    if (props[i] === '$') {
                        iter.push(new MorphineArray());
                    } else if (intRegexp.test(props[i])) {
                        if (typeof iter[props[i]] === 'undefined') {
                            console.error("Элемент %o не существует", props.slice(0, i + 1).join('.'));
                        }
                    } else {
                        iter[props[i]] = (typeof iter[props[i]] !== 'undefined') ? iter[props[i]] : new MorphineArray();
                    }
                } else {
                    if (intRegexp.test(props[i])) {
                        iter[props[i]] = (typeof iter[props[i]] !== 'undefined') ? iter[props[i]] : new Morphine();
                    } else if (props[i] === '$') {
                        iter.push(new Morphine());
                    } else {
                        iter[props[i]] = (typeof iter[props[i]] !== 'undefined') ? iter[props[i]] : new Morphine();
                    }
                }

                if (props[i] === '$') {
                    iter = iter[iter.length - 1];
                } else {
                    iter = iter[props[i]];
                }
            }
        }
        return base;
    }

    /**
     * Скопирует в прототип this все свойства объекта source
     * @param {Object} source объект с набором свойств для копирования
     **/
    Morphine.mixin = MorphineArray.mixin = function (source) {
        if (source) {
            for (var prop in source) {
                if (!source.hasOwnProperty(prop)) continue;
                this.prototype[prop] = source[prop];
            }
        }
    };

    /**
     * @private
     * Возвращает объект из источника
     * @param {Array} pathArray  массив содержащий путь до целевого элемента
     * @param {Object} source Объект-источник
     **/
    function getter(pathArray, source) {
        var index = pathArray.shift();

        if (!pathArray.length) {
            return source[index];
        }
        return getter(pathArray, source[index]);
    }

    return Morphine;
}));