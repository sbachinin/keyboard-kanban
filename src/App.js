import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Tables from './Tables';
import ColumnHeader from './ColumnHeader';
import TaskList from './TaskList';
import _ from 'lodash';
import shortId from 'shortid';
import dispatcher from './store/dispatcher';
import translateKeyToAction from './store/translateKeyToAction';

const blankColumns = _.range(5).map(i => { return { tasks: [] } });

let activeTableId = localStorage.getItem('activeTableId');
if (!activeTableId) {
  const id = shortId.generate();
  activeTableId = id;
  localStorage.setItem('activeTableId', id);
  localStorage.setItem(id, JSON.stringify({
    tableName: 'Untitled table',
    columns: blankColumns
  }));
}
const activeTable = JSON.parse(localStorage.getItem(activeTableId)) || {};

let shiftPressed;

class App extends Component {

  state = {
    activeTableId,
    tableName: activeTable.tableName || '???',
    columns: activeTable.columns,
    activeColumnIndex: 0,
    selectedHeaderItemIndex: 1,
    columnTitleIsEdited: false,
    columnTitleBeforeEdit: '',
    activeTaskIndex: 0,
    taskIsEdited: false,
  }

  getChildContext() { return { dispatcher: dispatcher }; }

  componentWillMount() {

    dispatcher.connect(
      _ => Object.assign({}, this.state),
      newState => {
        this.setState(newState);
      }
    )

    window.onblur = () => {
      shiftPressed = false;
    }

    this.scrollLeft = 0;

    document.addEventListener('keydown', e => {
      if (e.which === 16) {
        shiftPressed = true;
      }
      const actionType = translateKeyToAction(
        e.which,
        this.state,
        { shiftPressed }
      );
      console.log('action type: ', actionType);
      if (actionType) dispatcher.fireAction(actionType);
      
      if (e.which === 13) { // enter
        // to avoid adding new line before closing task edit
        if (!shiftPressed && this.state.taskIsEdited) e.preventDefault(); return false;
      }
    });

    document.addEventListener('keyup', e => {
      if (e.which === 16) {
        shiftPressed = false;
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this.scrollLeft = this.getScrollLeft();
    this.columnsElement.scrollLeft = this.scrollLeft;
  }


  // решить, куда прокрутить колонку, исходя из положения выделенного таска
  getScrollLeft() {
    const activeColumnElement = this.columnsElement
    .querySelectorAll('.columnWrapper')[this.state.activeColumnIndex];
    if (!activeColumnElement) return;
    const columnRect = activeColumnElement.getBoundingClientRect();
    const columnLeftFromWindowLeft = columnRect.left;
    const columnRightFromWindowLeft = columnRect.right;
    const leftOverlap = -columnLeftFromWindowLeft; // на сколько px вылез элемент выше окна?
    const rightOverlap = columnRightFromWindowLeft - window.innerWidth; // на сколько ниже?
    if (leftOverlap > 0) {
      return this.scrollLeft - leftOverlap;
    }
    if (rightOverlap > 0) {
      return this.scrollLeft + rightOverlap;
    }
    return this.scrollLeft;
  }


  getColumnTitle(columnIndex) {
    // take user-created title || by schema 3..2..1..Done
    const column = this.state.columns[columnIndex];
    if (typeof column.title !== 'undefined') {
      return column.title;
    } else if (columnIndex < (this.state.columns.length - 1)) {
      return this.state.columns.length - columnIndex - 1;
    } else {
      return 'Done';
    }
  }

  switchToTable(id) {
    const table = JSON.parse(localStorage.getItem(id));
    if (!table) return;
    const { tableName, columns } = table;
    this.setState({ tableName, columns,
      activeTableId: id,
      activeColumnIndex: 0,
      activeTaskIndex: 0
    });
  }


  render() {
    const {activeColumnIndex, activeTaskIndex} = this.state;
    const tablesActive = activeTaskIndex === -2;
    return (
      <div className="App">
        <Tables
          tablesActive={tablesActive}
          tableName={this.state.tableName}
          changeTableName={tableName => { this.setState({ tableName }); }}
          switchToTable={this.switchToTable.bind(this)}
          returnToColumns={() => { this.setState({ activeTaskIndex: -1 }); }}
        />
        <div className='columns'
          ref={comp => {
            if (!this.columnsElement) {
              this.columnsElement = ReactDOM.findDOMNode(comp);
            }
          }}
        >
          {
            this.state.columns.map((column, i) => {
              const headerActive = i === activeColumnIndex && activeTaskIndex === -1;
              const taskListActive = i === activeColumnIndex && activeTaskIndex > -1;
              return (
                <div className='columnWrapper' key={i}>
                  <ColumnHeader
                    headerActive={ headerActive }
                    columnTitle={ this.getColumnTitle(i) }
                    activeItemIndex={this.state.selectedHeaderItemIndex}
                    columnTitleIsEdited={this.state.columnTitleIsEdited}
                  />
                  <TaskList
                    tasks={column.tasks}
                    taskListActive={taskListActive}
                    activeTaskIndex={activeTaskIndex}
                    taskIsEdited={this.state.taskIsEdited}
                  />
                </div>
              )
            })
          }
        </div>
        <div className='hints'>Подсказки</div>
      </div>
    );
  }
}

App.childContextTypes = {
  dispatcher: PropTypes.object
};

export default App;