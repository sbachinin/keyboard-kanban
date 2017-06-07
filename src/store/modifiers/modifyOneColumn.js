// returns single column: { title: '...', tasks: ['...', '...'] }

export default {

  removeTask(state) {
    const activeColumn = state.columns[state.activeColumnIndex];
    const tasks = [
      ...activeColumn.tasks.slice(0, state.activeTaskIndex),
      ...activeColumn.tasks.slice(state.activeTaskIndex + 1)
    ];
    return Object.assign({}, activeColumn, { tasks });
  }


  , updateTitle(state, titleInputValue) {
    // if input value is not supplied, title should be reverted
    let title = titleInputValue;
    if (typeof title === 'undefined') title = state.columnTitleBeforeEdit; 
    return Object.assign({},
      state.columns[state.activeColumnIndex],
      { title }
    );
  }


  , moveTaskVert(state, direction) {
    const { columns, activeTaskIndex, activeColumnIndex } = state;

    const activeColumn = columns[activeColumnIndex];
    const movedTask = activeColumn.tasks[activeTaskIndex];

    const columnWithoutMovedTask = [
      ...activeColumn.tasks.slice(0, activeTaskIndex),
      ...activeColumn.tasks.slice(activeTaskIndex + 1)
    ];

    let newTasks;
    if (direction === 'up') {
      if (activeTaskIndex <= 0) return activeColumn;
      newTasks = [
        ...columnWithoutMovedTask.slice(0, activeTaskIndex - 1),
        movedTask,
        ...columnWithoutMovedTask.slice(activeTaskIndex - 1)
      ];
    } else { // down
      if (activeTaskIndex >= activeColumn.tasks.length - 1) return activeColumn;
      newTasks = [
        ...columnWithoutMovedTask.slice(0, activeTaskIndex + 1),
        movedTask,
        ...columnWithoutMovedTask.slice(activeTaskIndex + 1)
      ]
    }

    return Object.assign({}, activeColumn, {tasks: newTasks});
  }
  
}
