import { addTask, removeTask, tryEditColumnTitle, tryExpandTask, changeColumnTitle } from './actions';

export default {

  187(state, params) { // plus (or =)

    if (state.activeTaskIndex < 0) return {};

    return {
      columns: addTask(state),
      taskIsEdited: true,
      activeTaskIndex: 0
    };
  },

  8(state, params) { // backspace
    return {
      columns: removeTask(state)
    };
  },
  
  13(state, params) { // enter

    return {
      columnTitleIsEdited: tryEditColumnTitle(state),
      columns: changeColumnTitle(state),
      taskIsEdited: tryExpandTask(state)
    };
  },

  27(state, params) { // esc
    return {
      taskIsEdited: false,
      columnTitleIsEdited: false
    };
  }
}