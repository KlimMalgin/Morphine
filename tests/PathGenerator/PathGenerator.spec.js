
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

    assert.deepEqual(morphPathList, pathList, "Сравнение объекта генерируемого из пути и эталонного path-списка");

    var j = new Morphine({n: [{name: 1}]}),
        genPathList = j.toPaths(),
        jPathList = [
            "n",
            "n.0",
            "n.0.name"
        ];

    assert.deepEqual(genPathList, jPathList, "Сравнение объекта генерируемого из нативного объекта и эталонного path-списка");
});