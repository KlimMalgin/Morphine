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

            
            it('Генерация события add при создании нескольких вложенных объектов', function () {
                var addHandler = sinon.spy();
                var morph = new Morphine();

                morph.on('add', addHandler);
                morph.set('Application.Collections.Users.$');

                assert.equal(addHandler.callCount, 3, 'Обработчик события add вызван 3 раза');
            });

            it('Генерация change при изменении вложенного объекта', function () {
                var changeHandler = sinon.spy(),
                    morph = new Morphine();
                
                morph.on('change', changeHandler);
                morph.set('Application.Collections.Users.$');

                morph.set('Application.Collections.Comments.$');

                sinon.assert.calledOnce(changeHandler);
                sinon.assert.calledWith(changeHandler, 
                    sinon.match({
                        type: sinon.match("change"), 
                        path: sinon.match("Application.Collections"), 
                        fieldName: sinon.match("Collections")
                    })
                );
            });

        });

    });

});