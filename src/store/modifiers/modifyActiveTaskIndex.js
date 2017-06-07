
export default function modifyActiveTaskIndex(direction, state) {
  
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