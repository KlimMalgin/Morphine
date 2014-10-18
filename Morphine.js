'use strict';

(function (root, factory) {
    // Backbone-style settings
    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            root.Morphine = factory(root);
        });
    } else if (typeof module !== 'undefined') {
        module.exports = factory(root);
    } else {
        root.Morphine = factory(root);
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

    var intRegexp = /^[0-9]*$/;

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
         * Проверит является ли текущий объект пустым
         * @returns {boolean}
         */
        isEmpty: function () {
            for (var key in this) {
                if (this.has(key)) return false;
            }
            return true;
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
        /**
         * Выполнит merge src c текущим объектом
         * @param {Any Object} src 
         */
        merge: function (src) {
            if (src.isObject || src.isArray) {
                merger.call(this, src);
            } else {
                merger.call(this, converter.call(this, src));
            }
            return this;
        },
        /**
         * Установит свойство по указанному path
         * @param {String} path Путь по которому нужно установить значение
         * @param {*} value значение для установки в объекте
         * @return {Morphine} Текущий экземпляр объекта
         */
        set: function (path, value) {
            setter.call(this, path, value, true);
            return this;
        },
        /**
         * Вернет значение по указанному path
         * @param {String} path путь по которому нужно получить значение
         * @return {*} Значение расположенное по заданному пути
         */
        get: function (path) {
            var pathArray = path.split(CONFIG.separator);
            return getter(pathArray, this);
        },
        /**
         * Сконфигурирует текущий экземпляр объекта
         * @param {Object} options объект опций для конфигурирования текущего экземпляра Morphine
         * @return {Morphine} Текущий экземпляр объекта
         */
        config: function () {
            Configure.apply(this, arguments);
            return this;
        },
        /**
         * Сериализация Morphine-объекта в строку
         * return {String} Строковое представление текущего экземпляра объекта
         */
        stringify: function () {
            return stringifier.call(this);
        },
        /**
         * Преобразование Morphine-объекта в plain-объект
         */
        plain: function () {
            return JSON.parse(this.stringify());
        },
        /**
         * Преобразует текущий экземпляр объекта в массив path-элементов
         */
        toPaths: function () {
            return PathGenerator.call(this);
        },
        /**
         * Удалит вложенный объект или значение по указанному path
         */
        remove: function (path) {
            var pathArray = path.split(CONFIG.separator);
            var target = pathArray.pop();
            if (pathArray.length > 0) {
                var morph = getter(pathArray, this);
            } else {
                var morph = this;
            }
            if (morph.isArray() && intRegexp.test(target)) {
                morph.splice(target, 1);
            } else {
                delete morph[target];
            }
            return this;
        },
        /**
         * Очистит текущий экземпляр объекта
         */
        clear: function () {
            Clear.call(this);
            return this;
        },
        /**
         * Преобразует текущий экземпляр объекта в объект описаный
         * переданным массивом path-элементов
         */
        buildFromPaths: function (paths) {
            BuildFromPath.call(this, paths);
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
        if (typeof real === 'undefined' || real === null) return true;
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
     * @param {boolean} self Если true - добавит path и value в объект this. Если false - соберет path как отдельный объект и смерджит его с this
     **/
    function builder (path, value, self) {
        var pathArray = path.split(CONFIG.separator),
            morph = this;
          
        if (self) {
            innerBuilder.call(morph, pathArray, value);
        } else {
            // TODO: Возможно merge здесь не нужен. Проверить кейсы в коротых используется. Если кейс рабочий - описать его в тестах
            morph = new Morphine();
            innerBuilder.call(morph, pathArray, value);
            merger.call(this, morph);
        }
            
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
                            this[index] = (typeof this[index] !== 'undefined') ? this[index] : new MorphineArray();
                        }
                    } else if (testInt) {
                        if (intRegexp.test(index) || index === "$") {
                            this.push(new MorphineArray())
                        } else {
                            this[index] = (typeof this[index] !== 'undefined') ? this[index] : new MorphineArray();
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
        //var valToSet = (typeof value !== 'undefined') ? value : {},
        var valToSet = value,
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
     * @return {Morphine} Результат преобразования
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

                if (obj.hasOwnProperty(key) && (typeof obj[key] === 'undefined' || obj[key] === null)) {
                    //continue;
                    valueSetter.call(morph, key, obj[key]);
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
    
    /**
     * @private
     * Мерджит поля объекта src в this, если эти поля являются 
     * примитивными типами. Если встречает объект или массив - переходит
     * в него, создавая аналогичную вложенность в this и продолжает merge.
     * Объект должен быть Morphine-сущностью.
     * @param {Morphine} src Исходный объект для мерджа
     */
    // TODO: Как выполнится merge для массивов с разными размерностями
    function merger (src) {
        var dst = this;
        for (var key in src) {
            if (!src.has(key)) continue;
            
            if (src.has(key) && (src.isUndefined(key) || src.isNull(key))) {
                dst[key] = src[key];
            } else if (checkType(src[key].constructor)) {
                dst[key] = src[key];
            } else {
                if (!dst.has(key)) {
                    if (src[key].isArray()) {
                        dst[key] = new MorphineArray();
                    } else if (src[key].isObject()) {
                        dst[key] = new Morphine();
                    }
                }
                merger.call(dst[key], src[key]);
            }
        }
        return dst;
    }
    
    
    
    function stringifier() {
        var currentString = "";
        if (this.isObject()) {
            currentString = ObjectToString.call(this);
        } else if (this.isArray()) {
            currentString = ArrayToString.call(this);
        }
        
        function ObjectToString () {
            var obj = this;
            var start = "{", end = "}",
                result = [], item = "";
            for (var key in obj) {
                if (!obj.has(key)) continue;
                item += "\"" + key + "\":";
                if (obj[key].isObject && obj[key].isObject()) {
                    item += ObjectToString.call(obj[key]);
                } else
                // TODO: Bug. Метод isArray() не доступен в прототипе.
                if ((obj[key].isArray && obj[key].isArray()) || obj[key].constructor === Array) {
                    item += ArrayToString.call(obj[key]);
                } else
                if (checkType(obj[key])) {
                    if (checkType(obj[key], String)) {
                        item += "\"" + obj[key] + "\"";
                    } else {
                        item += obj[key];
                    }
                } else
                if (checkType(obj[key], Object) || checkType(obj[key], Array)) {
                    item += JSON.stringify(obj[key]);
                }
                result.push(item);item = "";
            }
            return start + result.join(',') + end;
        }

        function ArrayToString () {
            var obj = this;
            var start = "[", end = "]",
                result = [], item = "",
                ln = obj.length;
            for (var key = 0; key < ln; key++) {
                if (!obj.has(key) || key === 'length') continue;
                if (obj[key].isObject && obj[key].isObject()) {
                    item += ObjectToString.call(obj[key]);
                } else
                if (obj[key].isArray && obj[key].isArray()) {
                    item += ArrayToString.call(obj[key]);
                } else
                if (checkType(obj[key])) {
                    item += obj[key];
                } else
                if (checkType(obj[key], Object) || checkType(obj[key], Array)) {
                    item += JSON.stringify(obj[key]);
                }
                result.push(item);item = "";
            }
            return start + result.join(',') + end;
        }
        
        return currentString;
    }

    function PathGenerator () {
        var paths = [];
        if (this.isObject()) {
            ObjectPathGenerator.call(this, "", paths);
        } else
        if (this.isArray()) {
            ArrayPathGenerator.call(this, "", paths);
        }

        // TODO: Методы ObjectPathGenerator и ArrayPathGenerator идентичны. Нужно их реорганизовать
        function ObjectPathGenerator (prev_path, path_list) {
            var item = this;
            var path = "";
            var valueByPath;
            var pathObject;
            if (checkType(item)) {
                // TODO: Значения и простые типы не добавляем
            } else
            if (item.isEmpty()) {
                // TODO: Не ясно что добавлять в path
            } else {
                for (var key in item) {
                    // TODO: Проверка key === "length" - это костыль. Нужно избавиться от свойства length в массиве
                    if (!item.has(key) || key === "length") continue;
                    if (item.isObject && item.isObject()) {
                        // TODO: Повторяющаяся проверка. Нужно от нее избавиться
                        path = prev_path + ((prev_path.length && prev_path.length > 0) ? "." : "") + key;
                        valueByPath = item[key];
                        pathObject = {};
                        pathObject['path'] = path;
                        if (checkType(valueByPath)) { pathObject['value'] = valueByPath; }
                        path_list.push(pathObject);
                        ObjectPathGenerator.call(item[key], path, path_list);
                    } else
                    if (item.isArray && item.isArray()) {
                        // TODO: Повторяющаяся проверка. Нужно от нее избавиться
                        path = prev_path + ((prev_path.length && prev_path.length > 0) ? "." : "") + key;
                        valueByPath = item[key];
                        pathObject = {};
                        pathObject['path'] = path;
                        if (checkType(valueByPath)) { pathObject['value'] = valueByPath; }
                        path_list.push(pathObject);
                        ArrayPathGenerator.call(item[key], path, path_list);
                    }
                }
            }
        }

        function ArrayPathGenerator (prev_path, path_list) {
            var item = this;
            var path = "";
            var valueByPath;
            var pathObject;
            if (checkType(item)) {
                // TODO: Значения и простые типы не добавляем
            } else
            if (item.isEmpty()) {
                // TODO: Не ясно что добавлять в path
            } else {
                for (var key in item) {
                    // TODO: Проверка key === "length" - это костыль. Нужно избавиться от свойства length в массиве
                    if (!item.has(key) || key === "length") continue;
                    if (item.isObject && item.isObject()) {
                        // TODO: Повторяющаяся проверка. Нужно от нее избавиться
                        path = prev_path + ((prev_path.length && prev_path.length > 0) ? "." : "") + key;
                        valueByPath = item[key];
                        pathObject = {};
                        pathObject['path'] = path;
                        if (checkType(valueByPath)) { pathObject['value'] = valueByPath; }
                        path_list.push(pathObject);
                        ObjectPathGenerator.call(item[key], path, path_list);
                    } else
                    if (item.isArray && item.isArray()) {
                        // TODO: Повторяющаяся проверка. Нужно от нее избавиться
                        path = prev_path + ((prev_path.length && prev_path.length > 0) ? "." : "") + key;
                        valueByPath = item[key];
                        pathObject = {};
                        pathObject['path'] = path;
                        if (checkType(valueByPath)) { pathObject['value'] = valueByPath; }
                        path_list.push(pathObject);
                        ArrayPathGenerator.call(item[key], path, path_list);
                    }
                }
            }
        }

        return paths;
    }

    function Clear () {
        for (var key in this) {
            if (!this.hasOwnProperty(key)) continue;
            delete this[key];
        }
    }

    function BuildFromPath (paths) {
        this.clear();
        for (var key in paths) {
            if (!paths.hasOwnProperty(key)) continue;   //  || !('value' in paths[key])
            //this.set(paths[key].path, paths[key].value);
            builder.call(this, paths[key].path, paths[key].value, true);
        }
    }
    
    return Morphine;
}));
