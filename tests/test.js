

var assert = require("assert");
require("./Morphine");

describe('Common tests', function () {
    it('New Morphine is Object', function () {
        var m = new Morphine();
        assert.equal(m.isObject(), true, 'Is Object');
    });
});


describe('checkType()', function () {
    it('Стандартная проверка элементарных типов', function () {
        var checkType = MorphineShareApi.checkType;
        var bool = true,
            int = 24,
            str = "";

        assert.equal(checkType(bool), true, 'Переданное в checkType значение является элементарным типом Boolean');
        assert.equal(checkType(int), true, 'Переданное в checkType значение является элементарным типом Number');
        assert.equal(checkType(str), true, 'Переданное в checkType значение является элементарным типом String');
    });
});