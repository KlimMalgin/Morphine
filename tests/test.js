

var assert = require("assert");
require("./Morphine");

describe('Test availability', function () {
    it('New Morphine is Object', function () {
        var m = new Morphine();
        assert.equal(m.isObject(), true, 'Is Object');
    });
});


require('./utests/Common.spec');
require('./utests/Builder.spec');
require('./utests/PublicApi.spec');

require('./itests/Collections.spec');
require('./itests/Listeners.spec');
