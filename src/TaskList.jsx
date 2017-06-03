import React, { Component } from 'react';
import Task from './Task';
import ReactDOM from 'react-dom';

export default class TaskList extends Component {

  componentWillMount() {
    this.scrollTop = 0;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tasks.length === 1) { this.setState({activeTaskIndex: 0}); }
    if (this.props.tasks[0] !== nextProps.tasks[0]) { this.setState({activeTaskIndex: 0}); }
  }

  componentDidUpdate() {
    if (this.props.taskListActive) {
      this.scrollTop = this.getScrollTop();
      this.columnElement.scrollTop = this.scrollTop;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.tasks !== nextProps.tasks) return true;
    // if taskList is neither entered nor leaved, not touch it (?)
    if (!this.props.taskListActive && !nextProps.taskListActive) {
      return false;
    }
    return true;
  }

  // решить, куда прокрутить колонку, исходя из положения выделенного таска
  getScrollTop() {
    if (typeof this.scrollTop === 'undefined') return 0; // got undefined when left/right moving task that is scroll-far

    const activeTaskElement = this.columnElement
    .querySelectorAll('.task')[this.props.activeTaskIndex];
    if (!activeTaskElement) return;
    const taskRect = activeTaskElement.getBoundingClientRect();
    const taskTopFromWindowTop = taskRect.top;
    const taskBottomFromWindowTop = taskRect.bottom;
    const topOverlap = -taskTopFromWindowTop + 50; // на сколько px вылез элемент выше окна?
    const bottomOverlap = taskBottomFromWindowTop - window.innerHeight + 28; // на сколько ниже?
    // 28 - высота верхней/нижней панели + маржин между тасками
    if (topOverlap > 0) {
      return this.scrollTop - topOverlap;
    }
    if (bottomOverlap > 0) {
      return this.scrollTop + bottomOverlap;
    }
    return this.scrollTop;
  }


  render() {
    return (
      <div
        className={
          'column' +
          (this.props.taskListActive ? ' active' : '') +
          ((this.props.taskListActive && this.props.tasks.length === 0) ? ' highlighted' : '')
        }
        ref={comp => {
          if (!this.columnElement) {
            this.columnElement = ReactDOM.findDOMNode(comp);
          }
        }}
      >
        {
          (this.props.tasks || []).map((task, i) => {
            const taskcolumnIsActive = i === this.props.activeTaskIndex;
            const taskIsExpanded = this.props.taskListActive && taskcolumnIsActive && this.props.taskIsEdited;
            return (<Task
              key={i}
              taskIndex={i}
              text={this.props.tasks[i]}
              active={taskcolumnIsActive}
              expanded={taskIsExpanded}
            />);
          })
        }
      </div>
    )
  }
}
