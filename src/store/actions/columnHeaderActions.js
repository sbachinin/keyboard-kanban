import modifyColumns from '../modifiers/modifyColumns';
import modifyOneColumn from '../modifiers/modifyOneColumn';

export default {

  switchHeaderItemRight(state) {
    return {
      selectedHeaderItemIndex: state.selectedHeaderItemIndex + 1
    };
  }

  , switchHeaderItemLeft(state) {
    return {
      selectedHeaderItemIndex: state.selectedHeaderItemIndex - 1
    };
  }

  , switchToRightHeader(state) {
    return {
      selectedHeaderItemIndex: 1,
      activeColumnIndex: modifyColumns.switchColumnIndex('right', state)
    };
  }

  , switchToLeftHeader(state) {
    return {
      selectedHeaderItemIndex: 2,
      activeColumnIndex: modifyColumns.switchColumnIndex('left', state)
    };
  }


  , startEditingColumnTitle(state) {
    return {
      columnTitleIsEdited: true,
      columnTitleBeforeEdit: state.columns[state.activeColumnIndex].title
    }
  }


  , applyNewColumnTitle() {
    return {
      columnTitleIsEdited: false,
      columnTitleBeforeEdit: undefined
    }
  }

  , revertColumnTitle(state) {
    const newColumn = modifyOneColumn.updateTitle(state);
    return {
      columnTitleIsEdited: false,
      columns: modifyColumns.insertUpdatedColumn(newColumn, state)
    };
  }


  , updateColumnTitle(state, params) { // params.newTitle
    const newColumn = modifyOneColumn.updateTitle(state, params.newTitle);
    return { columns: modifyColumns.insertUpdatedColumn(newColumn, state) };
  }
  
}

