// они должны делать что-то со стейтом, принимая в аргументах стейт и что-то еще
// (например, shiftPressed)
// Должно быть множество методов, после запуска которых я сообщаю app, что стейт изменился,
// и передаю новое его значение
// Так что app должен подписаться на изменения в keyHandlers

import arrowKeyActions from './arrowKeyActions';
import otherKeyActions from './otherKeyActions';
import basicActions from './basicActions';
console.log(basicActions)
// these take state and return properties that should be updated (assigned)
const keyPressActions = {
	...arrowKeyActions,
	...otherKeyActions
}

let notifyApp;
let getStateCopy;

function trySaveToLocalStorage(state, newState) {
	if (state.columns !== newState.columns ||
		state.tableName !== newState.tableName ||
		// and when stop editing column title
		(state.columnTitleIsEdited && !newState.columnTitleIsEdited)
	) {
		const { columns, tableName } = newState;
	    const table = { columns, tableName };
	    localStorage.setItem(newState.activeTableId, JSON.stringify(table));
	}
}

export default {
	connect(getStateCopyFn, notifyAppFn) {
		notifyApp = notifyAppFn;
		getStateCopy = getStateCopyFn;
	},
	fireAction(actionType, actionData) {
		// actionType === 'changeTask'
		const state = getStateCopy();
		let action;
		if (actionType === 'keyUp') {
			action = keyPressActions[actionData.eWhich];
			if (!action) return state;
		} else {
			action = basicActions[actionType];
		}
		const newValues = action(state, actionData);
		const newState = Object.assign({}, state, newValues);

		trySaveToLocalStorage(state, newState);
		notifyApp(newState);
	} 
}