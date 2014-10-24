/**
 * Created by KlimMalgin on 21.10.2014.
 */
'use strict';

var assert = require("assert");
require("./Morphine");


describe('Public API tests', function () {
    //var PublicApi = MorphineShareApi.CommonPrototypeMixin;


    describe('Morphine constructor', function () {
        
        it('Create from object', function () {
            var source = {
                myObject: {
                    start: {
                        value: 'start object value'
                    },
                    end: {
                        value: 'end object value'
                    }
                },
                myArray: [
                    {
                        index: 0,
                        value: 96
                    },
                    {
                        index: 1,
                        value: 'text value'
                    }
                ]
            };
            var morph = new Morphine(source);
            assert.equal(morph.has('myObject.start.value'), true, 'Объект содержит структуру "myObject.start.value"');
            assert.equal(morph.get('myObject.start.value'), 'start object value', 'Структура "myObject.start.value" соответствует ожидаемому значению');
    
            assert.equal(morph.has('myObject.end.value'), true, 'Объект содержит структуру "myObject.end.value"');
            assert.equal(morph.get('myObject.end.value'), 'end object value', 'Структура "myObject.end.value" соответствует ожидаемому значению');
            
            assert.equal(morph.has('myArray.0.index'), true, 'Объект содержит структуру "myArray.0.index"');
            assert.equal(morph.get('myArray.0.index'), 0, 'Структура "myArray.0.index" соответствует ожидаемому значению');
            
            assert.equal(morph.has('myArray.0.value'), true, 'Объект содержит структуру "myArray.0.value"');
            assert.equal(morph.get('myArray.0.value'), 96, 'Структура "myArray.0.value" соответствует ожидаемому значению');
            
            assert.equal(morph.has('myArray.1.index'), true, 'Объект содержит структуру "myArray.1.index"');
            assert.equal(morph.get('myArray.1.index'), 1, 'Структура "myArray.1.index" соответствует ожидаемому значению');
            
            assert.equal(morph.has('myArray.1.value'), true, 'Объект содержит структуру "myArray.1.value"');
            assert.equal(morph.get('myArray.1.value'), 'text value', 'Структура "myArray.1.value" соответствует ожидаемому значению');
            
            assert.deepEqual(morph.plain(), source, 'Структура созданного Morphine-объекта соответствует исходной');
            
        });
    
        it('Create from path', function () {
            var morph = new Morphine('root.level1.level2.$.value.innerValue', 44);
            
            assert.equal(morph.has('root.level1.level2.0.value.innerValue'), true, 'Объект содержит структуру "root.level1.level2.0.value.innerValue"');
            assert.equal(morph.get('root.level1.level2.0.value.innerValue'), 44, 'Структура "root.level1.level2.0.value.innerValue" соответствует ожидаемому значению');
        });    
        
    });

    it('isObject', function () {
        var morph = new Morphine();
        assert.equal(morph.isObject(), true, 'Вновь созданая Morphine-сущность является объектом.');
        assert.notEqual(morph.isArray(), true, 'Вновь созданая Morphine-сущность не является массивом.');
    });

    it('isArray', function () {
        var morph = new Morphine('root.$');
        assert.equal(morph.get('root').isArray(), true, 'Вложенный в корень элемент "root" является массивом.');
        assert.notEqual(morph.get('root').isObject(), true, 'Вложенный в корень элемент "root" не является объектом.');
    });

    it('isNull', function () {
        var morph = new Morphine('root', null);
        assert.equal(morph.isNull('root'), true, 'Элемент "root" равен null.');
    });

    it('isUndefined', function () {
        var morph = new Morphine('root', undefined);
        assert.equal(morph.has('root'), true, 'Элемент "root" присутствует в созданном объекте.');
        assert.equal(morph.isUndefined('root'), true, 'Элемент "root" равен undefined.');
    });

    it('isEmpty', function () {
        var morph = new Morphine();
        assert.equal(morph.isEmpty(), true, 'Вновь созданный Morphine-объект является пустым.');
        morph.set('my.path', 'some value');
        assert.notEqual(morph.isEmpty(), true, 'Вновь созданный Morphine-объект не является пустым.');
    });

    it('has', function () {
        var morph = new Morphine('root.level1.level2.$.val', 'some value');
        assert.equal(morph.has('root'), true, 'Объект содержит "root" на текущем уровне.');

        var inner = morph.get('root.level1');
        assert.equal(inner.has('level2'), true, 'Объект содержит "level2" на текущем уровне.');
        assert.notEqual(inner.has('level3'), true, 'Объект не содержит "level3" на текущем уровне.');
        // ===
        assert.equal(morph.has('root.level1.level2'), true, 'Объект содержит вложенную структуру вида "root.level1.level2".');
    });


    describe('merge', function () {
        
        it('merge with morphine', function () {
            var morph = new Morphine('root.level1.level2.$.val', 'some value');
            var morph2 = new Morphine('root.level1_test', false);
            
            morph.merge(morph2);
            
            assert.equal(morph.has('root.level1.level2.0.val'), true, 'Объект содержит базовую структуру, по которой он был создан.');
            assert.equal(morph.has('root.level1_test'), true, 'Объект содержит структуру, которая была добавлена через merge.');
            assert.equal(morph.get('root.level1_test'), false, 'Значение структуры, добавленной через merge соответствует ожидаемому.');
    
        });
        
        it('merge with plain object', function () {
            var morph = new Morphine('root.level1.level2.$.val', 'some value');
            var morph2 = {
                root: {
                    level1_test: false
                }
            };
            
            morph.merge(morph2);
            
            assert.equal(morph.has('root.level1.level2.0.val'), true, 'Объект содержит базовую структуру, по которой он был создан.');
            assert.equal(morph.has('root.level1_test'), true, 'Объект содержит структуру, которая была добавлена через merge.');
            assert.equal(morph.get('root.level1_test'), false, 'Значение структуры, добавленной через merge соответствует ожидаемому.');
    
        });
    });

    it('set', function () {
        var morph = new Morphine();
            
        morph.set('path.part.first', 'is first part');
        assert.equal(morph.has('path.part.first'), true, 'Объект содержит структуру "path.part.first"');
        assert.equal(morph.get('path.part.first'), 'is first part', 'Структура "path.part.first" ссылается на ожидаемое значение');
    });
    
    // Символический тест. Просто чтобы был, т.к. get и без него повсеместно используется
    it('get', function () {
        var morph = new Morphine();
            
        morph.set('path.part.first', 'is first part');
        assert.equal(morph.get('path.part.first'), 'is first part', 'Структура "path.part.first" ссылается на ожидаемое значение');
    });
    
    it('config', function () {
        var morph = new Morphine();
            
        morph.config({
            separator: "/"
        });
            
        morph.set('path/part/first', 'path with slash-separate');
        assert.equal(morph.has('path/part/first'), true, 'Разбор строки с кастомным разделителем происходит корректно');
        assert.equal(morph.get('path/part/first'), 'path with slash-separate', 'Распарсили строку с кастомным разделителем и успешно получили ожидаемое значение');
    });
    
    //config
    /**
     * Сериализация Morphine-объекта в строку
     * return {String} Строковое представление текущего экземпляра объекта
     */
    //stringify
    /**
     * Преобразование Morphine-объекта в plain-объект
     */
    //plain
    /**
     * Преобразует текущий экземпляр объекта в массив path-элементов
     */
    //toPaths
    /**
     * Удалит вложенный объект или значение по указанному path
     */
    //remove
    /**
     * Очистит текущий экземпляр объекта
     */
    //clear
    /**
     * Преобразует текущий экземпляр объекта в объект описаный
     * переданным массивом path-элементов
     */
    //buildFromPaths


});
