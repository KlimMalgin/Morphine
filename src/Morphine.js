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

    /**
     * Конфигурационный объект для Morphine.
     * Настраивается через Morphine.config
     */
    var CONFIG = {
        
        /**
         * Разделительный символ, который будет использоваться в path.
         * По умолчанию это точка.
         */
        separator: '.'
        
    };

    function Morphine() {
        return MorphineBuilder.apply(this, arguments);
    }

    function MorphineArray() {}
    MorphineArray.prototype = new Array();
    MorphineArray.prototype = new MorphineArray();
    MorphineArray.prototype.constructor = MorphineArray;

    Morphine.prototype.version = '0.0.9';

    function MorphineBuilder () {
        var ln = arguments.length;
        
        switch (ln) {
            case 1:
                // м.б. объект или path-строка
                if (checkType(arguments[0], String)) {
                    setter.apply(this, arguments);
                } else                
                // TODO: Возникают проблемы с преобразованием в Morphine, если arguments[0] массив
                if (checkType(arguments[0], Object) || checkType(arguments[0], Array)) {
                    converter.call(this, arguments[0], true);
                }
                
            break;
            
            case 2:
                // м.б. path+значение
                setter.apply(this, arguments);
            break;      
        }
        return this;
    }
    
    var CommonPrototypeMixin = {
        isObject: function () {
            return this.constructor === Morphine;
        },
        isArray: function () {
            return this.constructor === MorphineArray;
        },
        /**
         * @public
         * Проверит свойство объекта на null
         * @param {String} key ключ элемента
         * @return {Boolean} Результат проверки. true - свойство === null, false - свойство !== null.
         **/
        isNull: function (key) {
            return this[key] === null;
        },
        /**
         * @public
         * Проверит свойство объекта на undefined
         * @param {String} key ключ элемента
         * @return {Boolean} Результат проверки. true - свойство === undefined, false - свойство !== undefined.
         **/
        isUndefined: function (key) {
            return typeof this[key] === 'undefined';
        },
        /**
         * @public
         * Проверит наличие свойства key в текущем объекте
         * @param {String} key ключ элемента
         * @return {Boolean} Результат проверки присутствия поля. true - присутствует, false - отсутствует.
         **/
        has: function (key) {
            return this.hasOwnProperty(key);
        },
        set: function (path, value) {
            setter.call(this, path, value);
            return this;
        },
        get: function (path) {
            var pathArray = path.split(CONFIG.separator);
            return getter(pathArray, this);
        },
        config: function () {
            Configure.apply(this, arguments);
            return this;
        }
    };
    
    var MorphinePrototypeMixin = {};
    var MorphineArrayPrototypeMixin = {};

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

    Morphine.mixin(CommonPrototypeMixin);
    MorphineArray.mixin(CommonPrototypeMixin);

    /**
     * @private
     * Метод конфигурирует дальнейшую работу с объектом
     * @param {Object} options Набор свойств для CONFIG-объекта
     */
    function Configure (options) {
        if (checkType(options, Object)) {
            CONFIG.separator = options.separator ? options.separator : CONFIG.separator;
        }
    }

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
        var pathArray = path.split(CONFIG.separator),
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
     * @param {*} obj объект для преобразования
     * @param {boolean} self true - преобразовать plain-объект в себя (в this), false - преобразовать в новый объект 
     */
    function converter (obj, self) {
        if (checkType(obj, Array)) {
            return toMorphine.call(this, obj, self ? null : MorphineArray);
        } else if (checkType(obj, Object)) {
            return toMorphine.call(this, obj, self ? null : Morphine);
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