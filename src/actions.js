
export function moveTaskRight(state) {
  
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

export function moveTaskLeft(state) {

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


export function moveTaskVert(direction, state) {
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

	return replaceColumn(newActiveColumn, state);
}

export function replaceTask(changedTask, state) {
	const { columns, activeColumnIndex, activeTaskIndex } = state;
	const activeColumn = columns[activeColumnIndex];

	const newActiveColumn = Object.assign({}, activeColumn, {
  	tasks: [
	    ...activeColumn.tasks.slice(0, activeTaskIndex),
	    changedTask,
	    ...activeColumn.tasks.slice(activeTaskIndex + 1)
	  ]
  });

  return replaceColumn(newActiveColumn, state);
}


export function addTask(state) {
	const { columns, activeColumnIndex } = state;
	const activeColumn = columns[activeColumnIndex];
  const newActiveColumn = Object.assign({}, activeColumn, {
  	tasks: [''].concat(activeColumn.tasks)
  });
  return replaceColumn(newActiveColumn, state);
}


export function removeTask(state) {
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
  return replaceColumn(newActiveColumn, state);
}


export function replaceColumn(newColumn, state) {
	const { activeColumnIndex, columns } = state;
	const newColumns = [
    ...columns.slice(0, activeColumnIndex),
    newColumn,
    ...columns.slice(activeColumnIndex + 1)
  ];
  return newColumns;
}

export function switchColumn(direction, state) {
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

export function switchTask(direction, state) {
	
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


export function changeColumnTitle(newTitle, state) {
  const newColumn = Object.assign({},
    state.columns[state.activeColumnIndex],
    { title: newTitle }
  );
  return replaceColumn(newColumn, state);
}

export function tryExpandTask(state) {
	// when pressing enter, is there a task corresponding to activeTaskIndex?
	// otherwise pressing enter on blank column will enter 'edit' of nothing & freeze navigation
	const activeTask = getActiveTask(state);
	if (state.activeTaskIndex >= 0 &&
		typeof activeTask !== 'undefined'
	) return true;
	return false;
}


function getActiveTask(state) {
	return state.columns[state.activeColumnIndex].tasks[state.activeTaskIndex];
}

