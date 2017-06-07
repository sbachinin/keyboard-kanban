
export default {
  removeColumn(state) {
    const lastColumnIsRemoved = (
      state.activeColumnIndex >= state.columns.length - 1
    );
    return {
      columns: [
        ...state.columns.slice(0, state.activeColumnIndex),
        ...state.columns.slice(state.activeColumnIndex + 1)
      ],
      activeTaskIndex: 0,
      activeColumnIndex: (
        // if removed the last one, select previous (now last) column, otherwise select next column (on old index)
        lastColumnIsRemoved ?
        state.activeColumnIndex - 1 : state.activeColumnIndex
      )
    };
  },
  addLeftColumn(state) {
    return {
      columns: [
        ...state.columns.slice(0, state.activeColumnIndex),
        { tasks: [] },
        ...state.columns.slice(state.activeColumnIndex)
      ],
      activeTaskIndex: 0
    };
  },
  addRightColumn(state) {
    return {
      columns: [
        ...state.columns.slice(0, state.activeColumnIndex + 1),
        { tasks: [], title: 'untitled' },
        ...state.columns.slice(state.activeColumnIndex + 1)
      ],
      activeTaskIndex: 0,
      activeColumnIndex: state.activeColumnIndex + 1
    };
  }
}