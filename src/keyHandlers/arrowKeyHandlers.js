import { switchColumn, switchActiveTaskIndex, moveTaskLeft, moveTaskRight, moveTaskVert } from './actions';

export default {

  37(state, params) { // LEFT
		// if in header, switch to left header item
		// and maybe go to left column header
		// if in tasks, go to left column
		// if shift, move task to left column
    if (state.columnTitleIsEdited) return {};

		let newProps = {};

		switch(state.activeTaskIndex) {
			case -2: break;

			case -1: {
				if (state.columnHeaderActiveIndex === 0) {
		      newProps.columnHeaderActiveIndex = 2;
					newProps.activeColumnIndex = switchColumn('left', state);
					newProps.activeTaskIndex = state.activeTaskIndex >= 0 ?
						0 : state.activeTaskIndex;
		    } else {
		    	newProps.columnHeaderActiveIndex = state.columnHeaderActiveIndex - 1;
		    }
		    break;
			}

			default: {
			  if (params.shiftPressed) {
					newProps.columns = moveTaskLeft(state);
				}
        if (!state.taskIsEdited || params.shiftPressed) {
  				newProps.activeColumnIndex = switchColumn('left', state);
        	newProps.activeTaskIndex = state.activeTaskIndex >= 0 ?
        		0 : state.activeTaskIndex;
        }
			}
		}
		return newProps;
  },

  39(state, params) { // RIGHT

    if (state.columnTitleIsEdited) return {};

		let newProps = {};

		switch(state.activeTaskIndex) {
			case -2: break;

			case -1: {
				if (state.columnHeaderActiveIndex === 3) {
		      newProps.columnHeaderActiveIndex = 1;
					newProps.activeColumnIndex = switchColumn('right', state);
					newProps.activeTaskIndex = state.activeTaskIndex >= 0 ?
						0 : state.activeTaskIndex;
		    } else {
		    	newProps.columnHeaderActiveIndex = state.columnHeaderActiveIndex + 1;
		    }
		    break;
			}

			default: {
			  if (params.shiftPressed) {
					newProps.columns = moveTaskRight(state);
				}
        if (!state.taskIsEdited || params.shiftPressed) {
  				newProps.activeColumnIndex = switchColumn('right', state);
        	newProps.activeTaskIndex = state.activeTaskIndex >= 0 ?
        		0 : state.activeTaskIndex;
        }
			}
		}
		return newProps;
  },

  40(state, params) { // DOWN

    if (state.columnTitleIsEdited) return {};

    let newProps = {};

    switch(state.activeTaskIndex) {
      case -2: break;

      case -1: {
        newProps.activeTaskIndex = switchActiveTaskIndex('down', state);
        break;
      }

      default: {
        if (params.shiftPressed) {
          newProps.columns = moveTaskVert('down', state);
        }
        if (!state.taskIsEdited || params.shiftPressed) {
          newProps.activeTaskIndex = switchActiveTaskIndex('down', state);
        }
      }
    }
    return newProps;
  },

  38(state, params) { // UP ARROW

    if (state.columnTitleIsEdited) return {};

    let newProps = {};

    switch(state.activeTaskIndex) {

      case -2: break;

      case -1: {
        newProps.activeTaskIndex = switchActiveTaskIndex('up', state);
        break;
      }
      case 0: {
        if (!params.shiftPressed && !state.taskIsEdited) {
          // switch up to column header only if task is not dragged
          newProps.activeTaskIndex = switchActiveTaskIndex('up', state);
        }
        break;
      }
      default: {
        if (params.shiftPressed) {
          newProps.columns = moveTaskVert('up', state);
        }
        // if editing task, switching task index is allowed only with drag
        if (!state.taskIsEdited || params.shiftPressed) {
          newProps.activeTaskIndex = switchActiveTaskIndex('up', state);
        }
      }
    }
    return newProps;
  }

}


