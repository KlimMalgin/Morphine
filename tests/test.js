

var assert = require("assert");
var Morphine = require("./Morphine.min");

describe('Common tests', function () {
    it('New Morphine is Object', function () {
        var m = new Morphine();
        assert.equal(m.isObject(), true, 'Is Object');
    });
});
