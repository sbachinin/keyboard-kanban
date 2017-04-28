import React, { Component } from 'react';
import Task from './Task';
import ReactDOM from 'react-dom';

class Column extends Component {
  state = {
    activeTaskIndex: 0
  }

  componentWillMount() {
    this.scrollTop = 0;
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

  componentDidUpdate() {
    if (this.props.columnIsActive) {
      this.scrollTop = this.getScrollTop();
      this.columnElement.scrollTop = this.scrollTop;
    }
  }

  // решить, куда прокрутить колонку, исходя из положения выделенного таска
  getScrollTop() {
    const activeTaskElement = this.columnElement
    .querySelectorAll('.task')[this.state.activeTaskIndex];
    if (!activeTaskElement) return;
    const taskRect = activeTaskElement.getBoundingClientRect();
    const taskTopFromWindowTop = taskRect.top;
    const taskBottomFromWindowTop = taskRect.bottom;
    const topOverlap = -taskTopFromWindowTop; // на сколько px вылез элемент выше окна?
    const bottomOverlap = taskBottomFromWindowTop - window.innerHeight; // на сколько ниже?
    if (topOverlap > 0) {
      return this.scrollTop - topOverlap - 10;
    }
    if (bottomOverlap > 0) {
      return this.scrollTop + bottomOverlap + 10;
    }
    return this.scrollTop;
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
    if (!this.props.columnIsActive) return;

    // эти действия надо совершать, только если все таски закрыты
    if (!this.state.activeTaskExpanded) {
      if (e.which === 39) { // RIGHT ARROW
        if (window.shiftPressed &&
          // если есть что двигать
          typeof this.props.tasks[this.state.activeTaskIndex] !== 'undefined') {
          this.props.moveTaskRight(this.state.activeTaskIndex);
        } else {
          this.props.switchToNextColumn();
        }
      }
      
      if (e.which === 37) { // LEFT ARROW
        if (window.shiftPressed &&
          typeof this.props.tasks[this.state.activeTaskIndex] !== 'undefined') {
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
        e.preventDefault();
        return false;
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
        e.preventDefault();
        return false;
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
      <div
        className={'column' + (this.props.columnIsActive ? ' active' : '')}
        ref={comp => {
          if (!this.columnElement) {
            this.columnElement = ReactDOM.findDOMNode(comp);
          }
        }}
      >{
        this.props.tasks.map((task, i) => {
          const taskcolumnIsActive = i === this.state.activeTaskIndex;
          const taskIsExpanded = this.props.columnIsActive && taskcolumnIsActive && this.state.activeTaskExpanded;
          return (<Task
            key={i}
            taskIndex={i}
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