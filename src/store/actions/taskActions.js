import modifyColumns from '../modifiers/modifyColumns';
import modifyOneColumn from '../modifiers/modifyOneColumn';
import moveTaskLeft from './moveTaskLeft';
import moveTaskRight from './moveTaskRight';
import modifyActiveTaskIndex from '../modifiers/modifyActiveTaskIndex';

export default {
  
  moveTaskLeft,
  moveTaskRight,

  switchToRightTask(state) {
    return {
      activeColumnIndex: modifyColumns.switchColumnIndex('right', state),
      activeTaskIndex: (state.activeTaskIndex >= 0 ?
          0 : state.activeTaskIndex)
    }
  }


  , switchToLeftTask(state) {
    return {
      activeColumnIndex: modifyColumns.switchColumnIndex('left', state),
      activeTaskIndex: (state.activeTaskIndex >= 0 ?
          0 : state.activeTaskIndex)
    }
  }


  , createTask(state) {
    const activeColumn = state.columns[state.activeColumnIndex];
    const updatedColumn = Object.assign({}, activeColumn, {
      tasks: [''].concat(activeColumn.tasks)
    });

    return {
      columns: modifyColumns.insertUpdatedColumn(updatedColumn, state),
      taskIsEdited: true,
      activeTaskIndex: 0,
      taskBeforeEdit: ''
    };
  }


  , startEditingTask(state) {
    return {
      taskIsEdited: true,
      taskBeforeEdit: state.columns[state.activeColumnIndex]
        .tasks[state.activeTaskIndex]
    }
  }


  , updateTask(state, params) { // typing in task textarea
    return { columns: modifyColumns.updateOneTask(state, params.newTask) };
  }


  , revertTask(state) { // undo changes when esc pressed
    return {
      taskIsEdited: false,
      columns: modifyColumns.updateOneTask(state, state.taskBeforeEdit)
    };
  }


  , applyNewTask() { // enter is pressed, must stop editing
    return {
      taskIsEdited: false,
      taskBeforeEdit: undefined
    }
  }


  , switchToUpperTask(state) {
    return {
      activeTaskIndex: modifyActiveTaskIndex('up', state),
      selectedHeaderItemIndex: 1
    };
  }

  , switchToLowerTask(state) {
    return {
      activeTaskIndex: modifyActiveTaskIndex('down', state),
      selectedHeaderItemIndex: 1
    };
  }

  , moveTaskUp(state) {
    const updatedColumn = modifyOneColumn.moveTaskVert(state, 'up');
    return {
      columns: modifyColumns.insertUpdatedColumn(updatedColumn, state),
      activeTaskIndex: modifyActiveTaskIndex('up', state)
    };
  }

  , moveTaskDown(state) {
    const updatedColumn = modifyOneColumn.moveTaskVert(state, 'down');
    return {
      columns: modifyColumns.insertUpdatedColumn(updatedColumn, state),
      activeTaskIndex: modifyActiveTaskIndex('down', state)
    };
  }

  , removeTask(state) {
    const lastTaskIsRemoved = (
      state.activeTaskIndex >= state.columns[state.activeColumnIndex].tasks.length - 1
    );
    return {
      columns: modifyColumns.removeTask(state),
      activeTaskIndex: ( lastTaskIsRemoved ?
        state.activeTaskIndex - 1 : state.activeTaskIndex
      )
    }
  }
}
