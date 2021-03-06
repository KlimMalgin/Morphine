'use strict';

var assert = require("assert");
var sinon = require("sinon");
var expect = require('chai').expect;

var Morphine = require("../Morphine");

describe('Listeners tests', function () {
    
    describe('Событие add', function () {
            
        it('Состояние event-объекта', function (cb) {
            var morph = new Morphine();

            morph.on('add', function (e) {
                // Event {type: "add", path: "Application", relativePath: "Application", fieldName: "Application"}
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
                addHandler = sinon.spy();

            morph.set('Application.Collections.Users.$');

            morph.on('add', addHandler);

            Users = morph.get('Application.Collections.Users');

            Users.set('$.value', 12);

            sinon.assert.callCount(addHandler, 2);
            
            expect(addHandler.getCall(0).args[0]).to.deep.equal({
                type: "add", 
                path: "Application.Collections.Users.0", 
                relativePath: "0",
                fieldName: "0"
            });
            expect(addHandler.getCall(1).args[0]).to.deep.equal({
                type: "add", 
                path: "Application.Collections.Users.0.value", 
                relativePath: "0.value",
                fieldName: "value"
            });
        });
    });

    describe('Событие change', function () {

        it('Генерация change при изменении вложенного объекта', function () {
            var changeHandler = sinon.spy(),
                morph = new Morphine();
            
            morph.on('change', changeHandler);
            morph.set('Application.Collections.Users.$');

            morph.set('Application.Collections.Comments.$');

            sinon.assert.callCount(changeHandler, 4);
            expect(changeHandler.getCall(0).args[0]).to.deep.equal({
                type: "change", 
                path: "Application",
                relativePath: "", 
                fieldName: "Application"
            });
            expect(changeHandler.getCall(1).args[0]).to.deep.equal({
                type: "change", 
                path: "Application.Collections",
                relativePath: "Application", 
                fieldName: "Collections"
            });
            expect(changeHandler.getCall(2).args[0]).to.deep.equal({
                type: "change", 
                path: "Application.Collections.Users",
                relativePath: "Application.Collections", 
                fieldName: "Users"
            });
            expect(changeHandler.getCall(3).args[0]).to.deep.equal({
                type: "change", 
                path: "Application.Collections.Comments",
                relativePath: "Application.Collections", 
                fieldName: "Comments"
            });
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
            
            // change field "type"
            expect(changeHandler.getCall(0).args[0]).to.deep.equal({
                type: "change", 
                path: "Application.Collections.Users.1.type",
                relativePath: "1", 
                fieldName: "type"
                // value: XX ???
            });
            
            // change object "Users.1"
            expect(changeHandler.getCall(1).args[0]).to.deep.equal({
                type: "change", 
                path: "Application.Collections.Users.0.value", 
                relativePath: "0", 
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
                relativePath: "1", 
                fieldName: "type"
                // value: XX ???
            });
            expect(changeHandler.getCall(1).args[0]).to.deep.equal({
                type: "change", 
                path: "Application.Collections.Users.0.value", 
                relativePath: "0", 
                fieldName: "value"
                // value: XX ???
            });
        });
    });

    describe('Событие remove', function () {

        it('Генерация remove на коллекции при удалении в ней элементов', function () { 
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
                relativePath: "2.el",
                fieldName: "el"
                // value: XX ???
            });
            expect(removeHandler.getCall(1).args[0]).to.deep.equal({
                type: "remove", 
                path: "Application.Collections.Users.2", 
                relativePath: "2",
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

        it('Генерация all при добавлении вложенного объекта', function () { 
            var morph = new Morphine('Application.Session.User', {
                    login: 'Vasya',
                    pass: 'SecretPass',
                    age: 23
                }),
                allHandler = sinon.spy();

            morph.on('all', allHandler);
            
            morph.set('Application.Session.User.sessionData', {
                token: 'hd6wh3d93msu7',
                timestamp: 33432423432
            });

            // --
            sinon.assert.callCount(allHandler, 2);
            
            expect(allHandler.getCall(0).args[0]).to.deep.equal({
                type: "add", 
                path: "Application.Session.User.sessionData", 
                relativePath: "Application.Session.User.sessionData", 
                fieldName: "sessionData"
                // value: XX ???
            });
            expect(allHandler.getCall(1).args[0]).to.deep.equal({
                type: "change", 
                path: "Application.Session.User.sessionData", 
                relativePath: "Application.Session.User", 
                fieldName: "sessionData"
                // value: XX ???
            });
            
        });

        it('Генерация all при изменении вложенного объекта', function () {
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
            
            // Бросает два change. На User и на login. А должен бросать один change
            expect(changeHandler.getCall(0).args[0]).to.deep.equal({
                type: "change", 
                path: "Application.Session.User.login", 
                relativePath: "Application.Session.User", 
                fieldName: "login"
                // oldValue: XX ???
                // newValue: XX ???
            });
        });

        it('Генерация all при удалении вложенного объекта', function () {
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
                relativePath: "Application.Session.User.login", 
                fieldName: "login"
                // oldValue: XX ???
                // newValue: XX ???
            }); 
        });

        it('Генерация all при добавлении элемента в коллекцию', function () {
            var addHandler = sinon.spy(),
                morph = new Morphine();
            
            morph.set('Application.Collections.Users.$');
            morph.on('add', addHandler);

            morph.set('Application.Collections.Users.$.login', 'Pol');

            sinon.assert.callCount(addHandler, 2);
            expect(addHandler.getCall(0).args[0]).to.deep.equal({
                type: "add", 
                path: "Application.Collections.Users.0",
                relativePath: "Application.Collections.Users.0", 
                fieldName: "0"
            }); 
        });

        it('Генерация all при изменении элемента в коллекции', function () {
            var changeHandler = sinon.spy(),
                morph = new Morphine();
            
            morph.set('Application.Collections.Users.$.login', 'Ilya');
            morph.on('change', changeHandler);

            morph.set('Application.Collections.Users.0.login', 'Pol');

            sinon.assert.callCount(changeHandler, 1);
            expect(changeHandler.getCall(0).args[0]).to.deep.equal({
                type: "change", 
                path: "Application.Collections.Users.0.login", 
                relativePath: "Application.Collections.Users.0",
                fieldName: "login"
                //value: ???
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

    describe('Additional tests', function() {
        
        it('Эмит change при добавлении поля в корень Morphine-структуры', function() {
            var changeHandler = sinon.spy(),
                morph = new Morphine();
                
            morph.on('change', changeHandler);
            morph.set('Application');

            sinon.assert.callCount(changeHandler, 1);
            expect(changeHandler.getCall(0).args[0]).to.deep.equal({
                type: "change", 
                path: "Application",
                relativePath: "", 
                fieldName: "Application"
            });

        });
        
    });

});