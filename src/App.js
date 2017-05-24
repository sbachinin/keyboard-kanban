import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Tables from './Tables';
import ColumnHeader from './ColumnHeader';
import TaskList from './TaskList';
import _ from 'lodash';
import shortId from 'shortid';

import {
  moveTaskRight, moveTaskLeft, moveTaskVert,
  removeTask, replaceTask, addTask,
  switchColumn, switchTask,
  changeColumnTitle, tryExpandTask
} from './actions';

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

class App extends Component {

  state = {
    activeTableId,
    tableName: activeTable.tableName || '???',
    columns: activeTable.columns,
    activeColumnIndex: 0,
    activeTaskIndex: 0,
    taskIsEdited: false
  }

  componentWillMount() {
    window.onblur = () => {
      window.shiftPressed = false;
    }

    this.scrollLeft = 0;
    localStorage;
    document.addEventListener('keydown', e => {
      if (e.which === 16) {
        window.shiftPressed = true;
      }
    });

    document.addEventListener('keyup', e => {
      let action;
      if (!this.state.taskIsEdited) {
        action = this.navigationActions[e.which];
      } else {
        action = this.taskEditActions[e.which];
      }
      if (action) action.call(this);
    });
  }

  
  taskEditActions = {
    
    16() { // SHIFT
      window.shiftPressed = false;
    },
    27() { // esc
      this.setState({ taskIsEdited: false });
      this.save();
    }
  }


  navigationActions = { // actions performed when task is NOT EDITED

    16() { // SHIFT
      window.shiftPressed = false;
    },

    39() { // RIGHT
      if (this.state.activeTaskIndex === -2) return;
      if (window.shiftPressed) {
        this.setState({ columns: moveTaskRight(this.state) });
      }
      this.setState({
        activeColumnIndex: switchColumn('right', this.state),
        activeTaskIndex: this.state.activeTaskIndex >= 0 ? 0 : this.state.activeTaskIndex
      });
    },

    37() { // LEFT
      if (this.state.activeTaskIndex === -2) return;
      if (window.shiftPressed) {
        this.setState({ columns: moveTaskLeft(this.state) });
      }
      this.setState({
        activeColumnIndex: switchColumn('left', this.state),
        activeTaskIndex: this.state.activeTaskIndex >= 0 ? 0 : this.state.activeTaskIndex
      });
    },

    38() { // UP ARROW
      if (window.shiftPressed) {
        this.setState({ columns: moveTaskVert('up', this.state) });
        // dont switch to column title when reaching first task position
        if (this.state.activeTaskIndex === 0) return;
      }
      this.setState({ activeTaskIndex: switchTask('up', this.state) });
    },

    40() { // DOWN ARROW
      if (this.state.activeTaskIndex === -2) return;
      if (window.shiftPressed) {
        this.setState({ columns: moveTaskVert('down', this.state) });
      }
      this.setState({ activeTaskIndex: switchTask('down', this.state) });
    },

    187() { // plus (or =)
      if (this.state.activeTaskIndex < 0) return;
      this.setState({
        columns: addTask(this.state)
      });
      // double setState <-- otherwise first task in column would not focus
      this.setState({
        taskIsEdited: true,
        activeTaskIndex: 0
      })
    },

    8() { // backspace
      this.setState({ columns: removeTask(this.state) });      
    },
    
    13() { // enter
      this.setState({ taskIsEdited: tryExpandTask(this.state) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.shouldSave(prevState)) {
      this.save();
    }
    this.scrollLeft = this.getScrollLeft();
    this.columnsElement.scrollLeft = this.scrollLeft;
  }

  save() {
    const { columns, tableName } = this.state;
    const table = { columns, tableName };
    localStorage.setItem(this.state.activeTableId, JSON.stringify(table));
  }

  shouldSave(prevState) {
    // save to storage only if columns or tableName changed BUT not while editing task
    if (this.state.taskIsEdited) return false;
    if (prevState.columns === this.state.columns &&
      prevState.tableName === this.state.tableName
    ) return false;
    return true;
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
                    changeColumnTitle={ newTitle => {
                      this.setState({
                        columns: changeColumnTitle(newTitle, this.state)
                      })
                    }}
                  />
                  <TaskList
                    tasks={column.tasks}
                    taskListActive={taskListActive}
                    replaceTask={newTask => {
                      this.setState({
                        columns: replaceTask(newTask, this.state)
                      });
                    }}
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

export default App;