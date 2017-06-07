export default function moveTaskRight(state) {
    
  const { columns, activeColumnIndex, activeTaskIndex } = state;

  const activeTask = state.columns[state.activeColumnIndex].tasks[state.activeTaskIndex];
  if (typeof activeTask === 'undefined') return {};
  if (activeColumnIndex >= columns.length - 1) return {};

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

  return {
    columns: [
      ...columns.slice(0, activeColumnIndex),
      giverColumn,
      takerColumn,
      ...columns.slice(activeColumnIndex + 2)
    ],
    activeColumnIndex: state.activeColumnIndex + 1,
    activeTaskIndex: 0
  };

}