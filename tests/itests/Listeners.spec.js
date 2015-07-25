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

                //assert.equal(addHandler.calledOnce, true, 'Обработчик события add вызван один раз');
                expect(addHandler.calledOnce).to.be.true;
            });
            
            it('Генерация события add при создании нескольких вложенных объектов', function () {
                var addHandler = sinon.spy();
                var morph = new Morphine();

                morph.on('add', addHandler);
                morph.set('Application.Collections.Users.$');

                //assert.equal(addHandler.callCount, 3, 'Обработчик события add вызван 3 раза');
                expect(addHandler.callCount).to.be.equal(3);
            });

            xit('Генерация change при изменении вложенного объекта', function () {
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

            xit('Генерация add на коллекции при добавлении элементов в нее', function () {
                var morph = new Morphine(),
                    Users = null,
                    addHandler = sinon.spy(),
                    changeHandler = sinon.spy();

                morph.set('Application.Collections.Users.$');

                morph.on('add', addHandler);
                morph.on('change', changeHandler);

                Users = morph.get('Application.Collections.Users');

                Users.set('$.value', 12);

                sinon.assert.callCount(addHandler, 2);
                sinon.assert.callCount(changeHandler, 0);
                
                expect(addHandler.getCall(0).args[0]).to.deep.equal({
                    type: "add", 
                    path: "0", 
                    fieldName: "0"
                });
                expect(addHandler.getCall(1).args[0]).to.deep.equal({
                    type: "add", 
                    path: "0.value", 
                    fieldName: "value"
                });
            });

            xit('Генерация change на коллекции при изменении в ней элементов', function () {
                var morph = new Morphine(),
                    Users = null,
                    addHandler = sinon.spy(),
                    changeHandler = sinon.spy();

                morph.set('Application.Collections.Users.$');

                Users = morph.get('Application.Collections.Users');

                Users.set('$.value', 12);
                Users.set('$.type', 'new');

                morph.on('add', addHandler);
                morph.on('change', changeHandler);

                // 'new' => 'old'
                Users.set('1.type', 'old');
                // 12 => 44
                Users.set('0.value', 44);
                // Операция increment на элементах

                sinon.assert.callCount(addHandler, 0);
                sinon.assert.callCount(changeHandler, 2);
                
                expect(changeHandler.getCall(0).args[0]).to.deep.equal({
                    type: "change", 
                    path: "1.type", 
                    fieldName: "type"
                    // value: XX ???
                });
                expect(changeHandler.getCall(1).args[0]).to.deep.equal({
                    type: "change", 
                    path: "0.value", 
                    fieldName: "value"
                    // value: XX ???
                });
            });

            it('Генерация remove на коллекции при удалении в ней элементов', function () { expect(true).to.be.false; });

            it('Генерация remove при изменении вложенного объекта', function () { expect(true).to.be.false; });

            it('Генерация all при добавлении вложенного объекта', function () { expect(true).to.be.false; });

            it('Генерация all при изменении вложенного объекта', function () { expect(true).to.be.false; });

            it('Генерация all при удалении вложенного объекта', function () { expect(true).to.be.false; });

            it('Генерация all при добавлении элемента в коллекцию', function () { expect(true).to.be.false; });

            it('Генерация all при изменении элемента в коллекции', function () { expect(true).to.be.false; });

            it('Генерация all при удалении элемента из коллекции', function () { expect(true).to.be.false; });

        });

    });

});