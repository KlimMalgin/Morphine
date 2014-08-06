
QUnit.module("PathGenerator");


QUnit.test("Генерация path-массива и сравнение его с эталоном", function(assert) {
    var morph = null;
    morph = new Morphine();
    morph.set('root.one.$.name', 'My custom value');

    var morphPathList = morph.toPaths(),
        pathList = [
            "root",
            "root.one",
            "root.one.0",
            "root.one.0.name"
        ];

    assert.deepEqual(morphPathList, pathList, "Сравнение генерируемого и эталонного path-списков");
});