'use strict';

var assert = require("assert");
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

        it('Добавление объекта в пустой объект', function (cb) {
            var morph = new Morphine();

            morph.on('add', function (e) {
                // Event {type: "add", path: "Application", fieldName: "Application"}
                assert.equal(e.type, 'add', 'Тип события: add');
                assert.equal(e.path, 'Application', 'Path == Application');
                assert.equal(e.fieldName, 'Application', 'fieldName == Application');
                cb();
            });

            morph.set('Application');
        });

    });

});