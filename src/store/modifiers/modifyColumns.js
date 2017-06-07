
import modifyOneColumn from '../modifiers/modifyOneColumn';


// these functions return array of columns

function switchColumnIndex(direction, state) {
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

function insertUpdatedColumn(newColumn, state) {
  const { activeColumnIndex, columns } = state;
  return [
    ...columns.slice(0, activeColumnIndex),
    newColumn,
    ...columns.slice(activeColumnIndex + 1)
  ];
}


function updateOneTask(state, updatedTask) {
  const { columns, activeColumnIndex, activeTaskIndex } = state;
  const activeColumn = columns[activeColumnIndex];

  const updatedColumn = Object.assign({}, activeColumn, {
    tasks: [
      ...activeColumn.tasks.slice(0, activeTaskIndex),
      updatedTask,
      ...activeColumn.tasks.slice(activeTaskIndex + 1)
    ]
  });

  return insertUpdatedColumn(updatedColumn, state);
}

function removeTask(state) {
  const activeTask = state.columns[state.activeColumnIndex].tasks[state.activeTaskIndex];
  if (typeof activeTask === 'undefined') return state.columns;

  const updatedColumn = modifyOneColumn.removeTask(state);
  return insertUpdatedColumn(updatedColumn, state);
}


export default {
  switchColumnIndex,
  insertUpdatedColumn,
  updateOneTask,
  removeTask
}