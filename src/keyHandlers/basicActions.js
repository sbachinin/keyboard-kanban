

function moveTaskRight(state) {
	  
  const { columns, activeColumnIndex, activeTaskIndex } = state;

	if (typeof getActiveTask(state) === 'undefined') return columns;
  if (activeColumnIndex >= columns.length - 1) return columns;

  const oldGiverColumn = Object.assign({}, columns[activeColumnIndex]);
  const oldTakerColumn = Object.assign({}, columns[activeColumnIndex + 1]);
  const movedTask = oldGiverColumn.tasks[activeTaskIndex];
  
  const giverColumn = Object.assign({},
		oldGiverColumn,
		{ tasks: [
		    ...oldGiverColumn.tasks.slice(0, activeTaskIndex),
		    ...oldGiverColumn.tasks.slice(activeTaskIndex + 1)
	  	]
	  }
  )

	const takerColumn = Object.assign({},
		oldTakerColumn,
		{ tasks: [
		    movedTask,
		    ...oldTakerColumn.tasks
		  ]
	  }
  )

  const newColumns = [
    ...columns.slice(0, activeColumnIndex),
    giverColumn,
    takerColumn,
    ...columns.slice(activeColumnIndex + 2)
  ];

  return newColumns;
}


function moveTaskLeft(state) {

	const { columns, activeColumnIndex, activeTaskIndex } = state;
	if (typeof getActiveTask(state) === 'undefined') return columns;

	if (activeColumnIndex === 0) return columns;

  const oldGiverColumn = Object.assign({}, columns[activeColumnIndex]);
  const oldTakerColumn = Object.assign({}, columns[activeColumnIndex - 1]);
  const movedTask = oldGiverColumn.tasks[activeTaskIndex];

	const giverColumn = Object.assign({},
		oldGiverColumn,
		{ tasks: [
	      ...oldGiverColumn.tasks.slice(0, activeTaskIndex),
	      ...oldGiverColumn.tasks.slice(activeTaskIndex + 1)
	    ]
	  }
  )

  const takerColumn = Object.assign({},
		oldTakerColumn,
		{
			tasks: [
	      movedTask,
	      ...oldTakerColumn.tasks
	    ]
		}
  )

  const newColumns = [
    ...columns.slice(0, activeColumnIndex - 1),
    takerColumn,
    giverColumn,
    ...columns.slice(activeColumnIndex + 1)
  ];

  return newColumns;
}


function moveTaskVert(direction, state) {
	const { columns, activeTaskIndex, activeColumnIndex } = state;

	if (activeTaskIndex < 0) return state.columns;

	const activeColumn = columns[activeColumnIndex];
  const movedTask = activeColumn.tasks[activeTaskIndex];

  const columnWithoutMovedTask = [
    ...activeColumn.tasks.slice(0, activeTaskIndex),
    ...activeColumn.tasks.slice(activeTaskIndex + 1)
  ];

  let newTasks;
	if (direction === 'up') {
		if (activeTaskIndex <= 0) return columns;
	  newTasks = [
	    ...columnWithoutMovedTask.slice(0, activeTaskIndex - 1),
	    movedTask,
	    ...columnWithoutMovedTask.slice(activeTaskIndex - 1)
	  ];
	} else { // down
		if (activeTaskIndex >= activeColumn.tasks.length - 1) return columns;
		newTasks = [
			...columnWithoutMovedTask.slice(0, activeTaskIndex + 1),
      movedTask,
      ...columnWithoutMovedTask.slice(activeTaskIndex + 1)
		]
	}

	const newActiveColumn = Object.assign({}, activeColumn, {tasks: newTasks});

	return updateColumn(newActiveColumn, state);
}


function changeTask(state, actionData) {
	const { columns, activeColumnIndex, activeTaskIndex } = state;
	const activeColumn = columns[activeColumnIndex];

	const newActiveColumn = Object.assign({}, activeColumn, {
  	tasks: [
	    ...activeColumn.tasks.slice(0, activeTaskIndex),
	    actionData.newTask,
	    ...activeColumn.tasks.slice(activeTaskIndex + 1)
	  ]
  });

  return updateColumn(newActiveColumn, state);
}


function addTask(state) {
	const { columns, activeColumnIndex } = state;
	const activeColumn = columns[activeColumnIndex];
  const newActiveColumn = Object.assign({}, activeColumn, {
  	tasks: [''].concat(activeColumn.tasks)
  });
  return updateColumn(newActiveColumn, state);
}


function removeTask(state) {
	if (state.activeTaskIndex <= -1) return state.columns;
	const activeTask = getActiveTask(state);
	if (typeof activeTask === 'undefined') return state.columns;

	const { columns, activeColumnIndex, activeTaskIndex } = state;
	const activeColumn = columns[activeColumnIndex];
	const tasks = [
    ...activeColumn.tasks.slice(0, activeTaskIndex),
    ...activeColumn.tasks.slice(activeTaskIndex + 1)
  ];
  const newActiveColumn = Object.assign({}, activeColumn, { tasks });
  return updateColumn(newActiveColumn, state);
}


function updateColumn(newColumn, state) {
	const { activeColumnIndex, columns } = state;
	const newColumns = [
    ...columns.slice(0, activeColumnIndex),
    newColumn,
    ...columns.slice(activeColumnIndex + 1)
  ];
  return { columns: newColumns };
}


function switchColumn(direction, state) {
  if (direction === 'right') {
  	if ((state.activeColumnIndex + 1) < state.columns.length) {
  		return state.activeColumnIndex + 1;
  	}
  	return state.activeColumnIndex;
  } else {
		if (state.activeColumnIndex > 0) {
			return state.activeColumnIndex - 1;
		}
		return 0;
  }
}


function switchActiveTaskIndex(direction, state) {
	
	if (direction === 'up') {
		if (state.activeTaskIndex > -2) {
			return state.activeTaskIndex - 1;
		}
		return -2;
	}
	if (direction === 'down') {
		const tasksCount = state.columns[state.activeColumnIndex].tasks.length;
		if (
			state.activeTaskIndex <= -1 || // shifting down from header and maybe no tasks in column
			(state.activeTaskIndex + 1) < tasksCount
		) {
			return state.activeTaskIndex + 1; 
		}
		return state.activeTaskIndex;
	}
}


function changeColumnTitle(state, actionData) {
	// new title is passed from onChange event and is equal to e.target.value
	// if it's not supplied, undo changes to column title (esc pressed)
	if (state.columnTitleIsEdited) {
		let title = actionData && actionData.newTitle;
	  const newColumn = Object.assign({},
	    state.columns[state.activeColumnIndex],
	    { title }
	  );
	  return updateColumn(newColumn, state);
	}
}


function tryExpandTask(state) {
	// when pressing enter, is there a task corresponding to activeTaskIndex?
	// otherwise pressing enter on blank column will enter 'edit' of nothing & freeze navigation
	const activeTask = getActiveTask(state);
	if (state.activeTaskIndex >= 0 &&
		typeof activeTask !== 'undefined'
	) return true;
	return false;
}


function toggleEditColumnTitle(state) {
	// we are on columnHeader and its active item index is 1 
	if (state.activeTaskIndex === -1 &&
		state.columnHeaderActiveIndex === 1 &&
		!state.columnTitleIsEdited) {
		return true;
	}
	return false;
}


function setColumnTitleBeforeEdit(state) {
	if (state.activeTaskIndex === -1 &&
		state.columnHeaderActiveIndex === 1 &&
		!state.columnTitleIsEdited) {
		return state.columns[state.activeColumnIndex].title;
	}
}


function getActiveTask(state) {
	return state.columns[state.activeColumnIndex].tasks[state.activeTaskIndex];
}

export default {
	moveTaskRight,
	moveTaskLeft,
	moveTaskVert,
	changeTask,
	addTask,
	removeTask,
	updateColumn,
	switchColumn,
	switchActiveTaskIndex,
	changeColumnTitle,
	tryExpandTask,
	toggleEditColumnTitle,
	setColumnTitleBeforeEdit,
	getActiveTask
}

