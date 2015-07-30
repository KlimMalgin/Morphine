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
            
        xit('Состояние event-объекта', function (cb) {
            var morph = new Morphine();

            morph.on('add', function (e) {
                // Event {type: "add", path: "Application", fieldName: "Application"}
                expect(e.type).to.equal('add');
                expect(e.relativePath).to.equal('Application');
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

        it('Генерация add на коллекции при добавлении элементов в нее', function () {
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
                path: "Application.Collections.Users.$", 
                relativePath: "$",
                fieldName: "$"
            });
            expect(addHandler.getCall(1).args[0]).to.deep.equal({
                type: "add", 
                path: "Application.Collections.Users.0.value", 
                relativePath: "$.value",
                fieldName: "value"
            });
        });
    });

    describe('Событие change', function () {

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

        it('Циферное обозначение номеров элементов в коллекции вместо знака $', function () {
            var morph = new Morphine(),
                Users = null,
                changeHandler = sinon.spy();

            morph.set('Application.Collections.Users.$');

            Users = morph.get('Application.Collections.Users');

            Users.set('$.value', 12);
            Users.set('$.type', 'new');

            morph.on('change', changeHandler);

            // 'new' => 'old'
            Users.set('1.type', 'old');
            // 12 => 44
            Users.set('0.value', 44);

            sinon.assert.callCount(changeHandler, 2);
            
            expect(changeHandler.getCall(0).args[0]).to.deep.equal({
                type: "change", 
                path: "Application.Collections.Users.1.type",
                relativePath: "1.type", 
                fieldName: "type"
                // value: XX ???
            });
            expect(changeHandler.getCall(1).args[0]).to.deep.equal({
                type: "change", 
                path: "Application.Collections.Users.0.value", 
                relativePath: "0.value", 
                fieldName: "value"
                // value: XX ???
            });
        });

        it('Генерация change на коллекции при изменении в ней элементов', function () {
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

            sinon.assert.callCount(addHandler, 0);
            sinon.assert.callCount(changeHandler, 2);
            
            expect(changeHandler.getCall(0).args[0]).to.deep.equal({
                type: "change", 
                path: "Application.Collections.Users.1.type",
                relativePath: "1.type", 
                fieldName: "type"
                // value: XX ???
            });
            expect(changeHandler.getCall(1).args[0]).to.deep.equal({
                type: "change", 
                path: "Application.Collections.Users.0.value", 
                relativePath: "0.value", 
                fieldName: "value"
                // value: XX ???
            });
        });
    });

    describe('Событие remove', function () {

        xit('Генерация remove на коллекции при удалении в ней элементов', function () { 
            var morph = new Morphine(),
                Users = null,
                removeHandler = sinon.spy();

            morph.set('Application.Collections.Users.$');
            Users = morph.get('Application.Collections.Users');

            Users.set('$.value', 12);
            Users.set('$.type', 'new');
            Users.set('$.el', 'nameElValue');

            morph.on('remove', removeHandler);

            Users.remove('2.el');
            Users.remove('2');

            // --
            sinon.assert.callCount(removeHandler, 2);
            
            expect(removeHandler.getCall(0).args[0]).to.deep.equal({
                type: "remove", 
                path: "Application.Collections.Users.2.el", 
                fieldName: "el"
                // value: XX ???
            });
            expect(removeHandler.getCall(1).args[0]).to.deep.equal({
                type: "remove", 
                path: "Application.Collections.Users.2", 
                fieldName: "2"
                // value: XX ???
            });
        });

        it('Генерация remove при удалении вложенного объекта', function () { 
            var morph = new Morphine('Application.Session.User', {
                    login: 'Vasya',
                    pass: 'SecretPass',
                    age: 23,
                    sessionData: {
                        token: 'hd6wh3d93msu7',
                        timestamp: 33432423432
                    }
                }),
                removeHandler = sinon.spy();

            morph.on('remove', removeHandler);

            morph.remove('Application.Session.User.sessionData.timestamp');
            morph.remove('Application.Session.User.sessionData');

            // --
            sinon.assert.callCount(removeHandler, 2);
            
            expect(removeHandler.getCall(0).args[0]).to.deep.equal({
                type: "remove", 
                path: "Application.Session.User.sessionData.timestamp", 
                relativePath: "Application.Session.User.sessionData.timestamp",
                fieldName: "timestamp"
                // value: XX ???
            });
            expect(removeHandler.getCall(1).args[0]).to.deep.equal({
                type: "remove", 
                path: "Application.Session.User.sessionData", 
                relativePath: "Application.Session.User.sessionData",
                fieldName: "sessionData"
                // value: XX ???
            });
        });
    });

    describe('Событие all', function () {

        xit('Генерация all при добавлении вложенного объекта', function () { 
            var morph = new Morphine('Application.Session.User', {
                    login: 'Vasya',
                    pass: 'SecretPass',
                    age: 23
                }),
                addHandler = sinon.spy();

            morph.on('all', addHandler);

            morph.set('Application.Session.User.sessionData', {
                token: 'hd6wh3d93msu7',
                timestamp: 33432423432
            });

            // --
            sinon.assert.callCount(addHandler, 1);
            
            expect(removeHandler.getCall(0).args[0]).to.deep.equal({
                type: "add", 
                path: "Application.Session.User.sessionData", 
                fieldName: "sessionData"
                // value: XX ???
            });
        });

        xit('Генерация all при изменении вложенного объекта', function () {
            var morph = new Morphine('Application.Session.User', {
                    login: 'Vasya',
                    pass: 'SecretPass',
                    age: 23
                }),
                changeHandler = sinon.spy();

            morph.on('all', changeHandler);

            morph.set('Application.Session.User.login', 'Oleg');

            // --
            sinon.assert.callCount(changeHandler, 1);
            
            expect(changeHandler.getCall(0).args[0]).to.deep.equal({
                type: "change", 
                path: "Application.Session.User.login", 
                fieldName: "login"
                // oldValue: XX ???
                // newValue: XX ???
            });
        });

        xit('Генерация all при удалении вложенного объекта', function () {
           var morph = new Morphine('Application.Session.User', {
                    login: 'Vasya',
                    pass: 'SecretPass',
                    age: 23
                }),
                removeHandler = sinon.spy();

            morph.on('all', removeHandler);

            morph.remove('Application.Session.User.login');

            // --
            sinon.assert.callCount(removeHandler, 1);
            
            expect(removeHandler.getCall(0).args[0]).to.deep.equal({
                type: "remove", 
                path: "Application.Session.User.login", 
                fieldName: "login"
                // oldValue: XX ???
                // newValue: XX ???
            }); 
        });

        xit('Генерация all при добавлении элемента в коллекцию', function () {
            var addHandler = sinon.spy(),
                morph = new Morphine();
            
            morph.set('Application.Collections.Users.$');
            morph.on('add', addHandler);

            morph.set('Application.Collections.Users.$.login', 'Pol');

            sinon.assert.callCount(addHandler, 2);
            expect(addHandler.getCall(0).args[0]).to.deep.equal({
                type: "add", 
                path: "Application.Collections.Users.0.login", 
                fieldName: "login"
            }); 
        });

        xit('Генерация all при изменении элемента в коллекции', function () {
            var changeHandler = sinon.spy(),
                morph = new Morphine();
            
            morph.set('Application.Collections.Users.$.login', 'Ilya');
            morph.on('change', changeHandler);

            morph.set('Application.Collections.Users.0.login', 'Pol');

            sinon.assert.callCount(changeHandler, 2);
            expect(changeHandler.getCall(0).args[0]).to.deep.equal({
                type: "change", 
                path: "Application.Collections.Users.0.login", 
                fieldName: "login"
            });
        });

        it('Генерация all при удалении элемента из коллекции', function () {
            var removeHandler = sinon.spy(),
                morph = new Morphine();
            
            morph.set('Application.Collections.Users.$.login', 'Ilya');
            morph.on('remove', removeHandler);

            morph.remove('Application.Collections.Users.0.login');

            sinon.assert.calledOnce(removeHandler);
            expect(removeHandler.getCall(0).args[0]).to.deep.equal({
                type: "remove", 
                path: "Application.Collections.Users.0.login", 
                relativePath: "Application.Collections.Users.0.login", 
                fieldName: "login"
            });
        });
    });

});