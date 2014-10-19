

var assert = require("assert");
require("./Morphine");

describe('Common tests', function () {
    it('New Morphine is Object', function () {
        var m = new Morphine();
        assert.equal(m.isObject(), true, 'Is Object');
    });
});
