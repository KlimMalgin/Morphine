
var morph = null;

QUnit.module( "PathGenerator", {
    setup: function() {
        morph = new Morphine();
        morph.set('root.one.$.name', 'My custom value');
    },
    teardown: function() {
        // clean up after each test
    }
});


QUnit.test("Генерация path-массива и сравнение его с эталоном", function(assert) {
    var morphPathList = morph.toPaths(),
        pathList = [
            "root",
            "root.one",
            "root.one.0",
            "root.one.0.name"
        ];

    assert.deepEqual(morphPathList, pathList, "Сравнение генерируемого и эталонного path-списков");
});