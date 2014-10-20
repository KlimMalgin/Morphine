/**
 * Created by KlimMalgin on 21.10.2014.
 */
'use strict';

var assert = require("assert");
require("./Morphine");


describe('Builder tests', function () {
    var builder = MorphineShareApi.builder;

    describe('Проверка сборки объекта', function () {

        it('Сборка набора вложенных объектов из строкового path. Без операции merge', function () {
            /**
             * За merge отвечает третий параметр метода builder
             */
            var morph = new Morphine();
            var expected = {
                root: {
                    l1: {
                        l2: {
                            l3: 45
                        }
                    }
                }
            };

            builder.call(morph, 'root.l1.l2.l3', 45, true);
            assert.deepEqual(morph, expected, 'Morphine-сущность собранная из path "root.l1.l2.l3" и значением 45 совпадает с ожидаемым объектом.');
        });

        it('Сборка набора вложенных объектов с массивами. Без операции merge', function () {
            var morph = new Morphine();
            var expected = {
                root: {
                    l1: [
                        {
                            value: 23
                        }
                    ]
                }
            };

            builder.call(morph, 'root.l1.$.value', 23, true);
            assert.deepEqual(morph, expected, 'Morphine-сущность собранная из path "root.l1.$.value" и значением 23 совпадает с ожидаемым объектом.');
        });

    });

});