'use strict';

var assert = require("assert");
require("../Morphine");


describe('Collections tests', function () {
    
    it('Создаем пустую коллекцию через через set', function () {
        var morph = new Morphine();
        morph.set('App.coll.pp.$');
        assert.equal(morph.get('App.coll.pp').isEmpty(), true, 'Создана пустая коллекция');
    });

    it('Создаем пустую коллекцию через конструктор', function () {
        var morph = new Morphine('App.coll.pp.$');
        assert.equal(morph.get('App.coll.pp').isEmpty(), true, 'Создана пустая коллекция');
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

    it('Создаем пустую коллекцию через конструктор и добавляем элементы методом set', function () {
        var morph = new Morphine('App.coll.pp.$');

        morph.set('App.coll.pp.$', {data: 'somedata'});
        morph.set('App.coll.pp.$', {data: 'somedata2'});

        assert.equal(morph.get('App.coll.pp').isEmpty(), false, 'Коллекция не пустая');
        assert.equal(morph.get('App.coll.pp.length'), 2, 'В коллекции два элемента');
    });



});