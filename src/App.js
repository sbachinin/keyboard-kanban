import React, { Component } from 'react';
import Column from './Column';

class App extends Component {

  state = {
    columns: JSON.parse(localStorage.getItem('tasksColumns')) || [[],[], [], [], []],
    activeColumnIndex: 0
  }

  
  componentWillMount() {
    localStorage;
    document.addEventListener('keydown', e => {
      if (e.which === 16) {
        window.shiftPressed = true;
      }
    });
    document.addEventListener('keyup', e => {
      if (e.which === 16) {
        window.shiftPressed = false;
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    localStorage.setItem('tasksColumns', JSON.stringify(this.state.columns));
  }

  switchToNextColumn() {
    const nextColumnIndex = (this.state.activeColumnIndex + 1) < this.state.columns.length ?
    (this.state.activeColumnIndex + 1) : this.state.activeColumnIndex;
    setTimeout(() => { this.setState({activeColumnIndex: nextColumnIndex}); });
  }

  switchToPrevColumn() {
    const prevColumnIndex = this.state.activeColumnIndex > 0  ?
    (this.state.activeColumnIndex - 1) : 0;
    setTimeout(() => {this.setState( {activeColumnIndex: prevColumnIndex}); });
  }

  changeColumn(columnIndex, newColumn) {
    const newColumns = [
      ...this.state.columns.slice(0, columnIndex),
      newColumn,
      ...this.state.columns.slice(columnIndex + 1)
    ];
    this.setState({
      columns: newColumns
    });
  }

  moveTaskRight(originalColumnIndex, movedTaskIndex) {
    if (originalColumnIndex >= this.state.columns.length - 1) return;
    const oldGiverColumn = this.state.columns[originalColumnIndex].slice();
    const oldTakerColumn = this.state.columns[originalColumnIndex + 1].slice();
    const movedTask = oldGiverColumn[movedTaskIndex];
    const giverColumn = [
      ...oldGiverColumn.slice(0, movedTaskIndex),
      ...oldGiverColumn.slice(movedTaskIndex + 1)
    ];
    const takerColumn = [
      movedTask,
      ...oldTakerColumn
    ];

    const newColumns = [
      ...this.state.columns.slice(0, originalColumnIndex),
      giverColumn,
      takerColumn,
      ...this.state.columns.slice(originalColumnIndex + 2)
    ];
    setTimeout(() => {
      this.setState({
        columns: newColumns,
        activeColumnIndex: this.state.activeColumnIndex + 1
      });
    });
  }

  moveTaskLeft(originalColumnIndex, movedTaskIndex) {
    if (originalColumnIndex === 0) return;
    const oldGiverColumn = this.state.columns[originalColumnIndex].slice();
    const oldTakerColumn = this.state.columns[originalColumnIndex - 1].slice();
    const movedTask = oldGiverColumn[movedTaskIndex];
    const giverColumn = [
      ...oldGiverColumn.slice(0, movedTaskIndex),
      ...oldGiverColumn.slice(movedTaskIndex + 1)
    ];
    const takerColumn = [
      movedTask,
      ...oldTakerColumn
    ];

    const newColumns = [
      ...this.state.columns.slice(0, originalColumnIndex - 1),
      takerColumn,
      giverColumn,
      ...this.state.columns.slice(originalColumnIndex + 1)
    ];
    setTimeout(() => {
      this.setState({
        columns: newColumns,
        activeColumnIndex: this.state.activeColumnIndex - 1
      });
    });
  }

  render() {
    return (
      <div className="App">
        {
          this.state.columns.map((column, i) => {
            const columnIsActive = i === this.state.activeColumnIndex;
            return (
              <Column
                key={i}
                tasks={column}
                columnIsActive={columnIsActive}
                changeColumn={this.changeColumn.bind(this, i)}
                switchToNextColumn={this.switchToNextColumn.bind(this)}
                switchToPrevColumn={this.switchToPrevColumn.bind(this)}
                moveTaskRight={this.moveTaskRight.bind(this, i)}
                moveTaskLeft={this.moveTaskLeft.bind(this, i)}
              />
            )
          })
        }
      </div>
    );
  }
}

export default App;