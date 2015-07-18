/*
Фантазии на тему API listener'ов
*/


var morph = new Morphine('App.collections.Users.$');

/*
Фичи
	- События:
		- add
		- change
		- remove
		- all

	- Всплытие событий

bubble должно быть отделным полем в объекте. В bubble должны присутствовать bubbleEmitter и bubbleHandler.
BubbleHandler это callback от родителя, который вызывается на объекте при возникновении любого события, 
либо при приходе всплывающего события снизу. Так каждый очередной объект уведомляется о всплывающем событии.
BubbleEmitter инициирует вызов BubbleHandler'a. Все.


Каждый объект/коллекция хранит свой список подписок. 
Реализовать опциональное всплытие событий. При всплытии, событие проходящее через каждый 
уровень структуры объекта должно дополнить свой пройденный path. Это нужно чтобы любой 
из получателей события мог узнать, кто эмитировал событие и при необходимости обратиться к нему.

Объект события должен быть самостоятельной сущностью. Должна быть возможность реализовать api событий

---
Bubble-события ловить только если подписка осуществлялась следующим способом:
morph.get('App.collections').on('change', 'App.collections.data', function (e) {  }); // Ловим всплывающие события с App.collections.data
morph.get('App.collections').on('change', '*', function (e) {  }); // Ловим всплывающие события со всех вложенных объектов



*/

// +
morph.get('App.collections').on('change', function (e) {  });

// -
morph.get('App.collections').on('change').then(function () {  });

// -
morph.get('App.collections').change().then(function () {  });

