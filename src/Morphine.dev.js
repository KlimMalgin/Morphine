'use strict';

    /**
     * Конфигурационный объект для Morphine.
     * Настраивается через Morphine.config
     */
    var CONFIG = {
        
        /**
         * Разделительный символ, который будет использоваться в path.
         * По умолчанию это точка.
         */
        separator: '.',

        /**
         * Всплытие событий в Morhine-структуре
         * true - включено
         * false - выключено
         */
    	bubbleEvent: true
    };

    var intRegexp = /^[0-9]*$/;

    function Morphine() {
    	this.bubbler = function (event) {
    		//console.log('>> Object ', this, event, this.stringify());
    	};

        return MorphineBuilder.apply(MorphineCreator(this.bubbler), arguments);
    }

    function MorphineArray() {
    	this.bubbler = function (event) {
    		//console.log('>> Array ', this, event, this.stringify());
    	};

        return MorphineArrayCreator(this.bubbler);
    }

    /*MorphineArray.prototype = new Array();
    MorphineArray.prototype = new MorphineArray();
    MorphineArray.prototype.constructor = MorphineArray;*/
    
    Morphine.prototype.version = '0.0.9';

    function MorphineCreator (bubbler) {
    	var f = function () {},
    		proto = new M(bubbler);
        
        f.prototype = proto;
        f.prototype.constructor = Morphine;

        return new f;
    }

    function MorphineArrayCreator (bubbler) {
    	var f = function () {},
    		proto = new MA(bubbler);

    		f.prototype = proto;
    		f.prototype.constructor = MorphineArray;

		return new f;
    }

    /**
	 * Прототип для Morphine. Содержит служебные поля и методы
     */
    function M (bubbler) {
    	var parent = this,
            myKey = null;
    	/**
		 * Подписчики на Morphine-события
    	 */
    	this.__subscribes = {
    		add: [], remove: [], change: [], all: []
    	};

    	this.bubbleHandler = function (event) {
            var k = this.getMyKey();
            if (event.path === null) {event.path = event.fieldName;}
            if (k) {event.path = k + CONFIG.separator + event.path;}
    		// Генерируем событие пришедшее от дочернего элемента на текущем объекте
    		parent.emit(event.type, event);
            //parent.emit('all', event);
    		// Передаем событие следующему родителю
    		parent.parentBubbleHandler(event);
    	};
		this.parentBubbleHandler = function(){};

		this.setParentBubbleHandler = function(parentBubbleHandler) {
			parent.parentBubbleHandler = parentBubbleHandler;
		};

        this.setMyKey = function (key) { myKey = key; };
        this.getMyKey = function () { return myKey; };

    	return this;
    }

    /**
	 * Прототип для MorphineArray. Содержит служебные поля и методы
     */
    function MA (bubbler) {
		var parent = this,
            myKey = null;
		/**
		 * Подписчики на Morphine-события
    	 */
    	this.__subscribes = {
    		add: [], remove: [], change: [], all: []
    	};

    	this.bubbleHandler = function (event) {
            var k = this.getMyKey();
            if (event.path === null) {event.path = event.fieldName;}
            if (k) {event.path = k + CONFIG.separator + event.path;}
    		// Генерируем событие пришедшее от дочернего элемента на текущем объекте
    		parent.emit(event.type, event);
    		//parent.emit('all', event);
    		// Передаем событие следующему родителю
    		parent.parentBubbleHandler(event);
    	};
		this.parentBubbleHandler = function(){};

		this.setParentBubbleHandler = function(parentBubbleHandler) {
			parent.parentBubbleHandler = parentBubbleHandler;
		};

        this.setMyKey = function (key) { myKey = key; };
        this.getMyKey = function () { return myKey; };

    	return this;
    }

    MA.prototype = new Array();
    MA.prototype = new MA();
    MA.prototype.constructor = MA;


	function Event (eventType, relativePath, fieldName) {
		/*stopPropagation: function () {...},*/
    	this.type = eventType;
        // Относительный путь от объекта, который инициировал генерацию пути
        this.relativePath = relativePath;
        // Полный путь от начала эмита до текущего объекта
    	this.path = null;
    	this.fieldName = fieldName;
		return this;
	}

    /**
	 * Создает объект события, которое будет эмиторивано внутри Morphine-структуры
     */
    function EventCreator (eventType, relativePath, fieldName) {
    	return new Event(eventType, relativePath, fieldName);
    }

    /**
	 * Эмитирует заданное событие и событие all
     */
    function EventEmitter (eventType, relativePath, fieldName) {
    	this.emit(eventType, EventCreator(eventType, relativePath, fieldName));
        this.emit('all', EventCreator(eventType, relativePath, fieldName));
        this.emitBubble(EventCreator(eventType, relativePath, fieldName));
    }

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
         * Проверит в текущем объекте наличие свойства path или структуры соответствующей пути указанном в path.
         * @param {String} path ключ элемента или path
         * @return {Boolean} Результат проверки присутствия поля. true - присутствует, false - отсутствует.
         **/
        has: function (path) {
            // TODO: path не гарантированно будет строкой. В случае работы с массивом - может прийти целочисленный индекс элемента массива
            if (path.constructor === Number) {
                return this.hasOwnProperty(path);
            }

            var pathArray = path.split(CONFIG.separator);
            if (pathArray.length === 1) {
                return this.hasOwnProperty(path);
            } else {
                var lastItem = pathArray.pop(),
                    checkObject = getter(pathArray, this);
                return checkObject.hasOwnProperty && checkObject.hasOwnProperty(lastItem);
            }
            return false;
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
            this.emit.call(morph, 'remove', EventCreator('remove', path, target));
            this.emit.call(morph, 'all', EventCreator('remove', path, target));
            this.emitBubble.call(morph, EventCreator('remove', path, target));
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


    // TODO: методы on, emit, emitBubble примешивать в прототип через mixin()
    var EventsPrototypeMixin = {

		/**
		 * Подпишет subfunc на событие eventType объекта this
		 */
		on: function (eventType, subfunc) {
			this.__subscribes[eventType].push(subfunc);
		}

    };

    /**
	 * Сгенерирует событие eventType на объекте this
     */
	M.prototype.emit = MA.prototype.emit = function(eventType, event) {
		var listeners = this.__subscribes[eventType],
		    allListeners = this.__subscribes['all'],
			ln = listeners ? listeners.length : 0,
			allLn = allListeners ? allListeners.length : 0;

		for (var i = 0; i<ln; i++) { listeners[i].call({}, event); }
		for (var i = 0; i<allLn; i++) { allListeners[i].call({}, event); }
	};

    /**
	 * Сгенерирует всплывающее событие на объекте this
     */
	M.prototype.emitBubble = MA.prototype.emitBubble = function(event) {
		if (this.parentBubbleHandler) { this.parentBubbleHandler(event); }
	};

	/*M.prototype.setParentBubbleHandler = MA.prototype.setParentBubbleHandler = function(parentBubbleHandler) {
		this.parentBubbleHandler = parentBubbleHandler;
	};*/

    /**
     * Скопирует в прототип this все свойства переданных объектов
     **/
    M.mixin = MA.mixin = function () {
        var ln = arguments.length;
        for (var i = 0; i < ln; i++) {
            if (checkType(arguments[i], Object)) {
                for (var prop in arguments[i]) {
                    if (!arguments[i].hasOwnProperty(prop)) continue;
                    this.prototype[prop] = arguments[i][prop];
                }
            }
        }
    };

    M.mixin(CommonPrototypeMixin, EventsPrototypeMixin, CONFIG);
    MA.mixin(CommonPrototypeMixin, EventsPrototypeMixin, CONFIG);

    /**
     * @private
     * Метод конфигурирует дальнейшую работу с объектом
     * @param {Object} options Набор свойств для CONFIG-объекта
     */
    function Configure (options) {
        if (checkType(options, Object)) {
            this.separator = options.separator ? options.separator : this.separator;
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
        // Значения null и undefined воспринимать как простые типы
        if (typeof real === 'undefined' || real === null) {
            if (ln > 1) {
                return true;
            } else {
                // TODO: Если в expect будет передан один из простых типов - вернем false и это будет неверно.
                return false;
            }
        }
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
     * @param {boolean} self Если true - добавит path и value в объект this. Если false - добавит path в объект this
     **/
    function builder (path, value, self) {
        var pathArray = path.split(CONFIG.separator),
        	currentLevel = [],
            morph = this;

        // TODO: WTF!!! Оба кейса одинаковые :) morph === this
        if (self) {
        	innerBuilder.call(morph, pathArray, value);
        } else {
            // TODO: Возможно merge здесь не нужен. Проверить кейсы в коротых используется. Если кейс рабочий - описать его в тестах
            //morph = new Morphine();
            innerBuilder.call(this, pathArray, value);
            //merger.call(this, morph);
        }
            
        function innerBuilder (pathArray, value) {
            var index = pathArray.shift();
            var testInt = intRegexp.test(pathArray[0]);
            var testCollection = pathArray[0] === '$';
            var tmpObject = null,
                tmpLn = null,
            	eventType = '',
            	isChange = false;

            if (index == '$') { /*index = */tmpLn = this.length.toString(); }
            currentLevel.push(index == '$' ? tmpLn : index);

            if (pathArray.length === 0) {
                if (index === '$') {
            		if (value) {
            			this.push(isMorphine(value) ? newObjectPrepare.call(this, value, tmpLn) : value);
            			EventEmitter.call(this, 'add', path, tmpLn);
            			// Здесь в change должен отправляться path - 1 элемент
            			// EventEmitter.call(this, 'change', path, tmpLn);
            		}
                } else if (intRegexp.test(index)) {
                    if (this.has(index) && typeof this[index] === 'undefined') {
                        this[index] = isMorphine(value) ? newObjectPrepare.call(this, value, index) : value;
            			EventEmitter.call(this, 'change', path, index);
                    } else if (!this.has(index)) {
                        this.push(isMorphine(value) ? newObjectPrepare.call(this, value, tmpLn) : value);
            			EventEmitter.call(this, 'add', path, tmpLn);
            			// Здесь в change должен отправляться path - 1 элемент
            			//EventEmitter.call(this, 'change', path, tmpLn);
                        // Проверка соответствия индексов при сборке объекта из path-массива
                        if (this.length-1 != index) console.error("Несоответствие индекса созданного элемента ожидаемому индексу");
                    }
                } else {
                    eventType = typeof this[index] !== 'undefined' ? 'change' : 'add';
                    this[index] = isMorphine(value) ? newObjectPrepare.call(this, value, index) : value;
                    EventEmitter.call(this, eventType, currentLevel.join(CONFIG.separator), index);
                }
                return;
            } else {
                if (testInt || testCollection) {
                    if (testCollection) {
                        if (index === "$") {
                            this.push(newObjectPrepare.call(this, new MorphineArray(), tmpLn));
                            EventEmitter.call(this, 'add', currentLevel.join(CONFIG.separator), tmpLn);
                        } else {
                        	isChange = typeof this[index] !== 'undefined';
                        	eventType = isChange ? 'change' : 'add';
                        	if (isChange) {
                        		this[index] = this[index];
                        	} else {
                        		this[index] = newObjectPrepare.call(this, new MorphineArray(), index);
                                EventEmitter.call(this, eventType, currentLevel.join(CONFIG.separator), index);
                                //--
                                EventEmitter.call(this, 'change', currentLevel.slice(0, currentLevel.length-1).join(CONFIG.separator), index);
                        	}
                            //this[index] = isChange ? this[index] : new MorphineArray();
                        }
                    } else if (testInt) {
                        if (intRegexp.test(index) || index === "$") {
                            this.push(newObjectPrepare.call(this, new MorphineArray(), tmpLn));
                            EventEmitter.call(this, 'add', currentLevel.join(CONFIG.separator), tmpLn);
                        } else {
                        	isChange = typeof this[index] !== 'undefined';
                        	eventType = isChange ? 'change' : 'add';
                            if (isChange) {
								this[index] = this[index];
                        	} else {
                        		this[index] = newObjectPrepare.call(this, new MorphineArray(), index);
                                EventEmitter.call(this, eventType, currentLevel.join(CONFIG.separator), index);
                                //--
                                EventEmitter.call(this, 'change', currentLevel.slice(0, currentLevel.length-1).join(CONFIG.separator), index);
                        	}
                        }
                    } else {
                        isChange = typeof this[index] !== 'undefined';
                    	eventType = isChange ? 'change' : 'add';
                        if (isChange) {
							this[index] = this[index];
                    	} else {
                    		this[index] = newObjectPrepare.call(this, new MorphineArray(), index);
                            EventEmitter.call(this, eventType, currentLevel.join(CONFIG.separator), index);
                            //--
                            EventEmitter.call(this, 'change', currentLevel.slice(0, currentLevel.length-1).join(CONFIG.separator), index);
                    	}
                    }
                } else {
                    if (intRegexp.test(index)) {
                        isChange = typeof this[index] !== 'undefined';
                    	eventType = isChange ? 'change' : 'add';
                        if (isChange) {
							this[index] = this[index];
                    	} else {
                    		this[index] = newObjectPrepare.call(this, new Morphine(), index);
                            EventEmitter.call(this, eventType, currentLevel.join(CONFIG.separator), index);
                            //--
                            EventEmitter.call(this, 'change', currentLevel.slice(0, currentLevel.length-1).join(CONFIG.separator), index);
                    	}
                    } else if (index === '$') {
                        this.push(newObjectPrepare.call(this, new Morphine(), tmpLn));
                        EventEmitter.call(this, 'add', currentLevel.join(CONFIG.separator), tmpLn);
                    } else {
                        isChange = typeof this[index] !== 'undefined';
                    	eventType = isChange ? 'change' : 'add';
                        if (isChange) {
							this[index] = this[index];
                    	} else {
                    		this[index] = newObjectPrepare.call(this, new Morphine(), index);
                            EventEmitter.call(this, eventType, currentLevel.join(CONFIG.separator), index);
                            //--
                            EventEmitter.call(this, 'change', currentLevel.slice(0, currentLevel.length-1).join(CONFIG.separator), index);
                    	}
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
     * Подготовит вновь созданный объект к работе
     **/
    function newObjectPrepare (obj, key) {
    	obj.setParentBubbleHandler(this.bubbleHandler);
        obj.setMyKey(key);
    	return obj;
    }

    function isMorphine (obj) {
    	if (checkType(obj, Morphine) || checkType(obj, MorphineArray)) {
            return true;
        }
        return false;
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
    
    
    // TODO: Так выглядит Боль
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
        pathBuilder.call(this, "", paths);
        
        function pathBuilder (prev_path, path_list) {
            var item = this;
            var path = "";
            var valueByPath;
            var pathObject;
            //var postfix;

            if (!checkType(item)){
                for (var key in item) {
                    // TODO: Проверка key === "length" - это костыль. Нужно избавиться от свойства length в массиве
                    if (!item.has(key) || key === "length") continue;
                    if ((item.isObject && item.isObject()) || (item.isArray && item.isArray())) {
                        //postfix = checkType(item[key], MorphineArray) ? '.$' : '';
                        path = prev_path + ((prev_path.length && prev_path.length > 0) ? "." : "") + key;
                        valueByPath = item[key];
                        pathObject = {};
                        pathObject['path'] = path;// + postfix;
                        if (checkType(valueByPath)) { pathObject['value'] = valueByPath; }
                        path_list.push(pathObject);
                        pathBuilder.call(item[key], path, path_list);
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
            if (!intRegexp.test(paths[key].path.split(CONFIG.separator).pop())) {
                builder.call(this, paths[key].path, paths[key].value, true);
            }
        }
    }

    function replaceGlobal () {
        global.Morphine = Morphine;
        return Morphine;
    }

    function shareApi () {
        global.MorphineShareApi = exports;
        return null;
    }

    exports.Morphine = replaceGlobal();

    exports.MorphineShareApi = shareApi();
