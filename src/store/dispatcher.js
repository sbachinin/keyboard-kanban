// these take state and return properties that should be updated (assigned)
import taskActions from './actions/taskActions';
import columnHeaderActions from './actions/columnHeaderActions';
import columnsActions from './actions/columnsActions';

const actions = {
	...columnsActions,
	...taskActions,
	...columnHeaderActions
};

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
	fireAction(actionType, params) {
		const state = getStateCopy();
		const action = actions[actionType];
		if (!action) return state;
		const newValues = action(state, params);
		const newState = Object.assign({}, state, newValues);

		trySaveToLocalStorage(state, newState);
		notifyApp(newState);
	} 
}