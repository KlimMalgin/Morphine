

var assert = require("assert");
require("./Morphine");

describe('Common tests', function () {
    it('New Morphine is Object', function () {
        var m = new Morphine();
        assert.equal(m.isObject(), true, 'Is Object');
    });
});


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

    /*describe('Проверка типа значений null и undefined', function () {
        // null и undefined в контексте Morphine должны определяться как элементарные типы
    });*/

});