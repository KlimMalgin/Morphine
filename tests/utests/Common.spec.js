/**
 * Created by KlimMalgin on 21.10.2014.
 */
'use strict';


var assert = require("assert");
require("../Morphine");


describe('checkType()', function () {
    var checkType = MorphineShareApi.checkType;

    it('Стандартная проверка элементарных типов', function () {
        var bool = true,
            int = 24,
            str = "";

        assert.equal(checkType(bool), true, 'Переданное в checkType значение является элементарным типом Boolean');
        assert.equal(checkType(int), true, 'Переданное в checkType значение является элементарным типом Number');
        assert.equal(checkType(str), true, 'Переданное в checkType значение является элементарным типом String');
    });

    describe('Проверка типов с явным заданием типа вторым аргументом', function () {
        it('Тип Boolean', function () {
            var bool = true;
            assert.equal(checkType(bool, Boolean), true, 'Переданное значение является типом Boolean');
            assert.notEqual(checkType(bool, Number), true, 'Переданное значение Не является типом Number');
            assert.notEqual(checkType(bool, String), true, 'Переданное значение Не является типом String');
            assert.notEqual(checkType(bool, Object), true, 'Переданное значение Не является типом Object');
            assert.notEqual(checkType(bool, Array), true, 'Переданное значение Не является типом Array');
        });

        it('Тип Number', function () {
            var int = 87;
            assert.equal(checkType(int, Number), true, 'Переданное значение является типом Number')
        });

        it('Тип String', function () {
            var str = "";
            assert.equal(checkType(str, String), true, 'Переданное значение является типом String');
        });

        it('Тип Object', function () {
            var obj = {};
            assert.equal(checkType(obj, Object), true, 'Переданное значение является типом Object');
        });

        it('Тип Array', function () {
            var arr = [];
            assert.equal(checkType(arr, Array), true, 'Переданное значение является типом Array');
        });

        it('Тип Morphine', function () {
            var m = new Morphine();
            assert.equal(checkType(m, Morphine), true, 'Переданное значение является типом Morphine');
        });

    });

    describe('Проверка типа значений null и undefined', function () {
        // null и undefined в контексте Morphine должны определяться как элементарные типы

        it('Проверка типа для undefined', function () {
            assert.equal(checkType(undefined), true, 'В контексте Morphine библиотеки undefined является простым типом');
        });

        it('Проверка типа для null', function () {
            assert.equal(checkType(null), true, 'В контексте Morphine библиотеки null является простым типом');
        });

        it('undefined не должен распознаваться как один из стандартных элементарных типов', function () {
            /**
             * Не смотря на то, что undefined и null определяются как элементарные типы - они тем не менее
             * являются самостоятельными и не соответствуют ни одному элементарному типу JS
             */

            assert.notEqual(checkType(undefined, Number), true, 'undefined не является производным от типа Number');
            assert.notEqual(checkType(undefined, String), true, 'undefined не является производным от типа String');
            assert.notEqual(checkType(undefined, Boolean), true, 'undefined не является производным от типа Boolean');

        });

        it('null не должен распознаваться как один из стандартных элементарных типов', function () {
            assert.notEqual(checkType(null, Number), true, 'null не является производным от типа Number');
            assert.notEqual(checkType(null, String), true, 'null не является производным от типа String');
            assert.notEqual(checkType(null, Boolean), true, 'null не является производным от типа Boolean');
        });

    });

});