import React, { Component } from 'react';
import Task from './Task';

class Column extends Component {
  state = {
    activeTaskIndex: 0
  }

  componentWillMount() {
    document.addEventListener('keyup', this.handleKeys.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tasks.length === 1) { this.setState({activeTaskIndex: 0}); }
    if (this.props.tasks[0] !== nextProps.tasks[0]) { this.setState({activeTaskIndex: 0}); }
    if (nextProps.columnIsActive &&
      (this.state.activeTaskIndex >= nextProps.tasks.length)
    ) {
      this.setState({ activeTaskIndex: nextProps.tasks.length - 1 });
    }
  }

  moveTaskUp() {
    if (this.state.activeTaskIndex === 0) return;
    const movedTask = this.props.tasks[this.state.activeTaskIndex];
    const columnWithoutMovedTask = [
      ...this.props.tasks.slice(0, this.state.activeTaskIndex),
      ...this.props.tasks.slice(this.state.activeTaskIndex + 1)
    ];
    const changedColumn = [
      ...columnWithoutMovedTask.slice(0, this.state.activeTaskIndex - 1),
      movedTask,
      ...columnWithoutMovedTask.slice(this.state.activeTaskIndex - 1)
    ];
    this.props.changeColumn(changedColumn);
  }


  moveTaskDown() {
    if (this.state.activeTaskIndex >= this.props.tasks.length - 1) return;
    const movedTask = this.props.tasks[this.state.activeTaskIndex];
    const columnWithoutMovedTask = [
      ...this.props.tasks.slice(0, this.state.activeTaskIndex),
      ...this.props.tasks.slice(this.state.activeTaskIndex + 1)
    ];
    const changedColumn = [
      ...columnWithoutMovedTask.slice(0, this.state.activeTaskIndex + 1),
      movedTask,
      ...columnWithoutMovedTask.slice(this.state.activeTaskIndex + 1)
    ];
    this.props.changeColumn(changedColumn);
  }

  handleKeys(e) {
    console.log('is column active? ', this.props.columnIsActive);
    if (!this.props.columnIsActive) return;

    // эти действия надо совершать, только если все таски закрыты
    if (!this.state.activeTaskExpanded) {
      if (e.which === 39) { // RIGHT ARROW
        if (window.shiftPressed) {
          this.props.moveTaskRight(this.state.activeTaskIndex);
        } else {
          this.props.switchToNextColumn();
        }
      }
      
      if (e.which === 37) { // LEFT ARROW
        if (window.shiftPressed) {
          this.props.moveTaskLeft(this.state.activeTaskIndex);
        } else {
          this.props.switchToPrevColumn();
        }
      }

      if (e.which === 38) { // TOP ARROW
        if (window.shiftPressed) {
          this.moveTaskUp();
        }
        const prevTaskIndex = this.state.activeTaskIndex > 0 ?
        this.state.activeTaskIndex - 1 : 0;
        this.setState({
          activeTaskIndex: prevTaskIndex
        });
      }

      if (e.which === 40) { // BOTTOM ARROW
        if (window.shiftPressed) {
          this.moveTaskDown();
        }
        const nextTaskIndex = (this.state.activeTaskIndex + 1) < this.props.tasks.length ?
        this.state.activeTaskIndex + 1 : this.state.activeTaskIndex;
        this.setState({
          activeTaskIndex: nextTaskIndex
        });
      }

      if (e.which === 187) { // plus (or =)
        const changedColumn = [''].concat(this.props.tasks);
        this.props.changeColumn(changedColumn);
        this.setState({
          activeTaskIndex: 0,
          activeTaskExpanded: true
        });
      }
      if (e.which === 189) { // minus
        const changedColumn = [
          ...this.props.tasks.slice(0, this.state.activeTaskIndex),
          ...this.props.tasks.slice(this.state.activeTaskIndex + 1)
        ];
        this.props.changeColumn(changedColumn);
      }
    }

    if (e.which === 13) { // enter
      this.setState({ activeTaskExpanded: true });
    }
    if (e.which === 27) { // esc
      this.setState({ activeTaskExpanded: false });
    }
  }

  changeTaskText(taskIndex, newText) {
    const newColumn = [
      ...this.props.tasks.slice(0, taskIndex),
      newText,
      ...this.props.tasks.slice(taskIndex + 1)
    ]
    this.props.changeColumn(newColumn);
  }

  render() {
    return (
      <div className={'column' + (this.props.columnIsActive ? ' active' : '')}>{
        this.props.tasks.map((task, i) => {
          const taskcolumnIsActive = i === this.state.activeTaskIndex;
          const taskIsExpanded = this.props.columnIsActive && taskcolumnIsActive && this.state.activeTaskExpanded;
          return (<Task
            key={i}
            text={this.props.tasks[i]}
            active={taskcolumnIsActive}
            expanded={taskIsExpanded}
            changeTaskText={this.changeTaskText.bind(this, i)}
          />);
        })
      }</div>
    )
  }
}

export default Column;