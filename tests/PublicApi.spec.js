/**
 * Created by KlimMalgin on 21.10.2014.
 */
'use strict';

var assert = require("assert");
require("./Morphine");


describe('Public API tests', function () {
    //var PublicApi = MorphineShareApi.CommonPrototypeMixin;

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

    /**
     * Выполнит merge src c текущим объектом
     * @param {Any Object} src
     */
    //merge
    /**
     * Установит свойство по указанному path
     * @param {String} path Путь по которому нужно установить значение
     * @param {*} value значение для установки в объекте
     * @return {Morphine} Текущий экземпляр объекта
     */
    //set
    /**
     * Вернет значение по указанному path
     * @param {String} path путь по которому нужно получить значение
     * @return {*} Значение расположенное по заданному пути
     */
    //get
    /**
     * Сконфигурирует текущий экземпляр объекта
     * @param {Object} options объект опций для конфигурирования текущего экземпляра Morphine
     * @return {Morphine} Текущий экземпляр объекта
     */
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
