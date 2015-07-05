
/**
 * Фантазии на тему того, как должен выглядеть rest-плагин для Morphine
 */

var Morphine = require('../build/Morphine');

Morphine.rest({

	// Базовый путь в объекте приложения до коллекций
	collectionBasePath: 'App.collections',

	session: {
		url: '/session',
		type: 'POST',

		// Название коллекции, которая лежит в collectionBasePath, либо целиком path до коллекции и ее название
		collection: 'Session'
	},

	users: {

		// опционально. Если не задано - берется ключ текущего объекта.
		url: '/users',

		// При обращении на users получим список пользователей
		type: 'GET',

		collection: 'Users',

		// Метод срабатывает перед отправкой любого /users... запроса на заданный url
		before: function (request, data) {  },
		// Метод срабатывает, когда от сервера возвращается ответ на любой из /users... запросов
		after:  function (response, data, error) {  },


		/**
		 * Кастомные хендлеры для rest-api
		 */
		handlers: {

			// "/users/add"
			add: function (response, data, error) {  }, // after

			// "/users/remove/{userId}"
			remove: function (response, data, error) {  },	// after

			// "/users/{userId}/edit"
			edit: {

				// @optional
				url: '/edit',

				type: 'POST',

				before: function () {  },
				after: function () {  }
			}
		}

/*
		get: {
			before: function (request, data) {  },
			after: function (response, data, error) {  }
		},
		post: function (data, error) {  },	// after*/
	},

	artists: {},

	cards: {},

	common: {}

});


// Примеры обращения к rest через Morphine rest api
Morphine.rest.users.get(/* userId or users filter */).then(/*...*/);

Morphine.rest.users.edit.post(/* user data */).then(/*...*/);
