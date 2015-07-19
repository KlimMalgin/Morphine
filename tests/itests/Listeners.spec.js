'use strict';

var assert = require("assert");
var sinon = require("sinon");
var expect = require('chai').expect;

require("../Morphine");


// Создаем пустой объект, слушаем, добавляем структуру, проверяем
// Создаем объект по path, слушаем, добавляем структуру
// Создаем объект из plain-объекта

// Создаем коллекции, слушаем изменения коллекции
// Проверяем события add, change, remove и всплывающие 
// Проверяем события на текущем объекте и всплывающие

// Проверяем реакцию на все всплывающие события при подписке на all.
// Проверяем реакцию на все события текущего объекта при подписке на all.

describe('Listeners tests', function () {
    
    describe('Событие add', function () {

        describe('set path в пустой объект', function () {
            
            it('Состояние event-объекта', function (cb) {
                var morph = new Morphine();

                morph.on('add', function (e) {
                    // Event {type: "add", path: "Application", fieldName: "Application"}
                    expect(e.type).to.equal('add');
                    expect(e.path).to.equal('Application');
                    expect(e.fieldName).to.equal('Application');                    
                    cb();
                });

                morph.set('Application');
            });

            
            it('Количество вызовов event-listener метода', function () {
                var addHandler = sinon.spy();
                var morph = new Morphine();

                morph.on('add', addHandler);
                morph.set('Application');

                assert.equal(addHandler.calledOnce, true, 'Обработчик события add вызван один раз');
            });



        });

    });

});