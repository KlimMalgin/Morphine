/*
Фантазии на тему API listener'ов
*/


var morph = new Morphine('App.collections.Users.$');

/*
События:
add
change
remove
all

Каждый объект/коллекция хранит свой список подписок. 
Реализовать опциональное всплытие событий. При всплытии, событие проходящее через каждый 
уровень структуры объекта должно дополнить свой пройденный path. Это нужно чтобы любой 
из получателей события мог узнать, кто эмитировал событие и при необходимости обратиться к нему.

Объект события должен быть самостоятельной сущностью. Должна быть возможность сделать stop propagation

*/


morph.get('App.collections').on('change', function (e) {  });

morph.get('App.collections').on('change').then(function () {  });

morph.get('App.collections').change().then(function () {  });

