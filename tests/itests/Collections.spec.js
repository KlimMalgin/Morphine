'use strict';

var assert = require("assert");
require("../Morphine");


describe('Collections tests', function () {
    
    it('Создаем коллекцию с одним элементом через через set', function () {
        var morph = new Morphine();
        morph.set('App.coll.pp.$', {});
        assert.equal(morph.get('App.coll.pp').isEmpty(), false, 'Создана пустая коллекция');
    });

    it('Элементы будут добавлены в коллекцию только если они заданы явно', function () {
        var morph = new Morphine('App.coll.pp.$');
        assert.equal(morph.get('App.coll.pp').isEmpty(), true, 'Value не задано - создана пустая коллекция');
        morph.set('App.coll.pp.$', {
            my: 'element',
            data: 'item'
        });
        assert.equal(morph.get('App.coll.pp').isEmpty(), false, 'Создана пустая коллекция');
        assert.equal(morph.get('App.coll.pp').length, 1, 'Длина коллекции == 1');
    });

/*
При обращении по пути 'App.coll.pp.$'
элемент должен добавляться, только если он передан явно. Если же value не указано, то ничего не добавляем
*/

    it('Коллекция созданныя ч/з конструктор без указания value должна быть пустая', function () {
        var morph = new Morphine('App.coll.pp.$');
        assert.equal(morph.get('App.coll.pp').isEmpty(), true, 'Коллекция пустая');
        assert.equal(morph.get('App.coll.pp').length, 0, 'Длина коллекции == 0');
    });

    it('Добавляем элементы в коллекцию через set без указания value', function () {
        var morph = new Morphine('App.coll.pp.$');
        morph.set('App.coll.pp.$');
        morph.set('App.coll.pp.$');
        // --
        assert.equal(morph.get('App.coll.pp').isEmpty(), true, 'Коллекция пустая');
        assert.equal(morph.get('App.coll.pp').length, 0, 'Длина коллекции == 0');
    });

    it('Создаем пустую коллекцию через конструктор и преобразуем ее в JSON-строку', function () {
        var morph = new Morphine('App.coll.pp.$'),
            expect = '{"App":{"coll":{"pp":[]}}}',
            mStr = morph.stringify();
        assert.equal(mStr, expect, 'Пустая коллекция создана и преобразована в JSON-строку');
    });

    it('Создаем пустой Morphine-объект, добавляем коллекцию, несколько элементов и проверяем длину', function () {
        var morph = new Morphine();

        morph.set('App.coll.pp.$', {data: 'somedata'});
        morph.set('App.coll.pp.$', {data: 'somedata2'});

        assert.equal(morph.get('App.coll.pp').isEmpty(), false, 'Коллекция не пустая');
        assert.equal(morph.get('App.coll.pp.length'), 2, 'В коллекции два элемента');
    });

    it('Создаем коллекцию через конструктор и добавляем элементы методом set', function () {
        var morph = new Morphine('App.coll.pp.$');

        morph.set('App.coll.pp.$', {data: 'somedata'});
        morph.set('App.coll.pp.$', {data: 'somedata2'});

        assert.equal(morph.get('App.coll.pp').isEmpty(), false, 'Коллекция не пустая');
        assert.equal(morph.get('App.coll.pp.length'), 2, 'В коллекции два элемента');
    });



});