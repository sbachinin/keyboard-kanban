import basicActions from './basicActions';

export default {

  187(state, params) { // plus (or =)

    if (state.activeTaskIndex < 0) return {};

    return {
      columns: basicActions.addTask(state),
      taskIsEdited: true,
      activeTaskIndex: 0
    };
  },

  8(state, params) { // backspace
    return {
      columns: basicActions.removeTask(state)
    };
  },
  
  13(state, params) { // enter

    return {
      columnTitleIsEdited: basicActions.toggleEditColumnTitle(state),
      columnTitleBeforeEdit: basicActions.setColumnTitleBeforeEdit(state),
      taskIsEdited: basicActions.tryExpandTask(state)
    };
  },

  27(state, params) { // esc
    return {
      taskIsEdited: false,
      columnTitleIsEdited: false,
      columns: basicActions.changeColumnTitle(state, {
        newTitle: state.columnTitleBeforeEdit
      }) // return column title to initial saved value
    };
  }
}