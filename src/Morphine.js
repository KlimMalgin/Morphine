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

    function Morphine(obj, value) {
        if (obj) {
            setter.call(this, obj, value);
        }
    }

    function MorphineArray() {}
    MorphineArray.prototype = new Array();
    MorphineArray.prototype = new MorphineArray();
    MorphineArray.prototype.constructor = MorphineArray;

    Morphine.prototype.version = '0.0.9';

    var CommonPrototypeMixin = {
        isObject: function () {
            return this.constructor === Morphine;
        },
        isArray: function () {
            return this.constructor === MorphineArray;
        },
        set: function (path, value) {
            setter.call(this, path, value);
        },
        get: function (path) {
            var pathArray = path.split('.');
            return getter(pathArray, this);
        }
    };
    
    var MorphinePrototypeMixin = {};
    var MorphineArrayPrototypeMixin = {};

    /**
     * Скопирует в прототип this все свойства объекта source
     * @param {Object} source объект с набором свойств для копирования
     **/
    // TODO: Где используется mixin?
    Morphine.mixin = MorphineArray.mixin = function (source) {
        if (source) {
            for (var prop in source) {
                if (!source.hasOwnProperty(prop)) continue;
                this.prototype[prop] = source[prop];
            }
        }
    };

    Morphine.mixin(CommonPrototypeMixin);
    MorphineArray.mixin(CommonPrototypeMixin);

    /**
     * @private
     * Проверяет соответствие фактического типа real примитивным типам.
     * Если задан ожидаемый тип expect, то проверяется соответствие только с ним.
     */
    function checkType (real, expect) {
        expect = expect ? [expect] : [Boolean, String, Number];
        var ln = expect.length;
        for (var i = 0; i < ln; i++) {
            if (expect[i] === real || expect[i] === real.constructor) {
                return true;
            }
        }
        return false;
    }

    /**
     * @private
     * Метод выстроит объект по структуре указанной в path. Если указано 
     * значение value - присвоит его последнему элементу.
     * @param {String} path Задает структуру объекта для построения
     * @param {*} value Значение последнего элемента в path
     **/
    function builder (path, value) {
        var pathArray = path.split('.'),
            intRegexp = /^[0-9]$/;
            
        innerBuilder.call(this, pathArray, value);
            
        function innerBuilder (pathArray, value) {
            var index = pathArray.shift();
            var testInt = intRegexp.test(pathArray[0]);
            var testCollection = pathArray[0] === '$';
            
            if (pathArray.length === 0) {
                if (index === '$') {
                    this.push(value);
                } else if (intRegexp.test(index)) {
                    if (typeof this[index] === 'undefined') {
                        // TODO: Заменить все console-выводы на исключения
                        console.error("Элемент %o не существует", index);
                    }
                } else {
                    this[index] = value;
                }
                return;
            } else {
                if (testInt || testCollection) {
                    if (testCollection) {
                        if (index === "$") {
                            this.push(new MorphineArray());
                        } else {
                            this[index] = new MorphineArray();
                        }
                    } else if (testInt) {
                        if (typeof this[index] === 'undefined') {
                            console.error("Элемент %o не существует", index);
                        }
                    } else {
                        this[index] = (typeof this[index] !== 'undefined') ? this[index] : new MorphineArray();
                    }
                } else {
                    if (intRegexp.test(index)) {
                        this[index] = (typeof this[index] !== 'undefined') ? this[index] : new Morphine();
                    } else if (index === '$') {
                        this.push(new Morphine());
                    } else {
                        this[index] = (typeof this[index] !== 'undefined') ? this[index] : new Morphine();
                    }
                }  
                
                // Если в коллекцию $ был добавлен очередной элемент - получаем его индекс, для дальнейшего построения
                if (index === '$') {
                    index = this.length-1;
                }
            }
            
            innerBuilder.call(this[index], pathArray, value);
        }
    }

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


    /**
     * @private
     * Метод установит значение по указанному path. Если path или его часть
     * не существует, то недостающие элементы будут выстроены в соответствии
     * со структурой path.
     * @param {String} path Задает элемент для установки значения
     * @param {*} value Значение последнего элемента в path. По умолчанию - пустой объект
     * @return {Morphine} Получившийся объект
     **/
    function setter(path, value) {
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

        builder.bind(this)(path, checkResult ? valToSet : converter.bind(mObject)(valToSet));
        return this;
    }

    /**
     * Преобразует plain объект/массив в Morphine-сущность
     */
    function converter (obj) {
        if (checkType(obj, Array)) {
            return toMorphine.call(this, obj, MorphineArray);
        } else if (checkType(obj, Object)) {
            return toMorphine.call(this, obj, Morphine);
        } else {
            // obj является примитивным или кастомным типом, поэтому вернем его без изменений
            return obj;
        }
        
        function toMorphine (obj, construct) {
            var morph = construct ? new construct() : this;
            
            for (var key in obj) {
                if (!obj.hasOwnProperty(key)) continue;

                if (typeof obj[key] === 'undefined' || obj[key] === null) {
                    continue;
                } else if (checkType(obj[key], Object)) {
                    valueSetter.call(morph, key, toMorphine.call(morph, obj[key], Morphine));
                } else if (checkType(obj[key], Array)) {
                    valueSetter.call(morph, key, toMorphine.call(morph, obj[key], MorphineArray));
                } else if (checkType(obj[key])) {
                    valueSetter.call(morph, key, obj[key]);
                } else {
                    console.error("Конструктор не определен %o %o %o", obj, key, obj[key]);
                }
            }
            
            return morph;
        }
        
        function valueSetter (key, value) {
            if (this.isObject()) {
                this.set(key, value);
            } else if (this.isArray()) {
                this.push(value);
            }
        }
        return morph;
    }

    return Morphine;
}));