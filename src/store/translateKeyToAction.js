
const translators = {

  37(state, params) { // LEFT

    if (state.columnTitleIsEdited) return '';

    switch(state.activeTaskIndex) {
      case -2: return '';

      case -1: {
        if (state.selectedHeaderItemIndex === 0) {
          if (state.activeColumnIndex > 0) return 'switchToLeftHeader';
          return '';
        }
        return 'switchHeaderItemLeft';
      }

      default: {
        if (params.shiftPressed) { return 'moveTaskLeft'; }
        if (!state.taskIsEdited || params.shiftPressed) {
          return 'switchToLeftTask'; }
      }
    }
  },


  39(state, params) { // RIGHT

    if (state.columnTitleIsEdited) return '';

    switch(state.activeTaskIndex) {
      case -2: return ''; // nothing to do if tables selected

      case -1: { // if header is selected
        if (state.selectedHeaderItemIndex === 3) {
          if (state.activeColumnIndex < state.columns.length - 1) {
            return 'switchToRightHeader';
          }
          return '';
        }
        return 'switchHeaderItemRight';
      }

      default: { // if taskList is selected
        if (params.shiftPressed) { return 'moveTaskRight'; }
        if (!state.taskIsEdited || params.shiftPressed) {
          return 'switchToRightTask';
        }
      }
    }
  },

  40(state, params) { // DOWN
    if (state.columnTitleIsEdited) return '';
    switch(state.activeTaskIndex) {
      case -2: return '';
      case -1: { return 'switchToLowerTask'; }
      default: {
        if (params.shiftPressed) {
          return 'moveTaskDown';
        }
        if (!state.taskIsEdited || params.shiftPressed) {
          return 'switchToLowerTask'
        }
      }
    }
  },

  38(state, params) { // UP ARROW
    if (state.columnTitleIsEdited) return '';
    switch(state.activeTaskIndex) {

      case -2: break;

      case -1: { return 'switchToUpperTask'; }
      case 0: {
        if (!params.shiftPressed && !state.taskIsEdited) {
          // switch up to column header only if task is not dragged
          return 'switchToUpperTask';
        }
        break;
      }
      default: {
        if (params.shiftPressed) {
          return 'moveTaskUp';
        }
        // if editing task, switching task index is allowed only with drag
        if (!state.taskIsEdited || params.shiftPressed) {
          return 'switchToUpperTask';
        }
      }
    }
  },


  187(state, params) { // PLUS (+ or =)
    if (state.activeTaskIndex < 0 || params.shiftPressed || state.taskIsEdited) return '';
    return 'createTask';
  },


  27(state, params) { // ESC
    switch(state.activeTaskIndex) {
      case -2: return ''; // nothing to do if tables selected

      case -1: { // if header is selected
        if (state.selectedHeaderItemIndex === 1 &&
          state.columnTitleIsEdited) {
          return 'revertColumnTitle'; }
        break;
      }

      default: { // if taskList is selected
        if (state.taskIsEdited) return 'revertTask';
      }
    }
  },
  

  13(state, params) { // ENTER
    switch(state.activeTaskIndex) {
      case -2: return '';
      case -1: {
        switch(state.selectedHeaderItemIndex) {
          case 0: return 'addLeftColumn';
          case 1: {
            if (state.columnTitleIsEdited) return 'applyNewColumnTitle';
            return 'startEditingColumnTitle';
          }
          case 2: return 'removeColumn';
          case 3: return 'addRightColumn';
          default: return '';
        }
      }
      default: {
        if (state.taskIsEdited) {
          if (!params.shiftPressed) return 'applyNewTask';
          return '';
        }
        return 'startEditingTask';
      }
    }
  },


  8(state, params) { // BACKSPACE
    if (state.activeTaskIndex >= 0 && !state.taskIsEdited) return 'removeTask';
  }
}


// should return a string with actionType according to
// 1) what key is pressed and 2) what area is selected
export default function(eWhich, state, params) {
  const translator = translators[eWhich];
  if (translator) {
    return translator(state, params);
  }
}
