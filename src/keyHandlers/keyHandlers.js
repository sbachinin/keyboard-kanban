// они должны делать что-то со стейтом, принимая в аргументах стейт и что-то еще
// (например, shiftPressed)
// Должно быть множество методов, после запуска которых я сообщаю app, что стейт изменился,
// и передаю новое его значение
// Так что app должен подписаться на изменения в keyHandlers

import arrowKeyHandlers from './arrowKeyHandlers';
import otherKeyHandlers from './otherKeyHandlers';

// these take state and return properties that should be updated (assigned)
const handlers = {
	...arrowKeyHandlers,
	...otherKeyHandlers
}

let notifyApp;

function trySaveToLocalStorage(state, newState) {
	if (state.columns !== newState.columns ||
		state.tableName !== newState.tableName
	) {
		const { columns, tableName } = newState;
	    const table = { columns, tableName };
	    localStorage.setItem(newState.activeTableId, JSON.stringify(table));
	}
}

export default {
	subscribe(fn) {
		notifyApp = fn;
	},
	fire(key, state, params) {
		const fn = handlers[key];
		if (!fn) return state;
		const newParams = fn(state, params);
		const newState = Object.assign({}, state, newParams);

		trySaveToLocalStorage(state, newState);
		notifyApp(newState);
	} 
}