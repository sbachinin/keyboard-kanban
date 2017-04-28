import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import autosize from 'autosize';

class Task extends Component {
  
  componentDidMount() {
    autosize(this.textarea);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.expanded && nextProps.expanded) {
      setTimeout(() => { autosize.update(this.textarea); this.textarea.focus(); }, 0);
    }
    if (this.props.expanded && !nextProps.expanded) {
      this.textarea.blur();
    }
  }

  render() {
    return (
      <div className={'task' +
        (this.props.active ? ' active' : '') +
        (this.props.expanded ? ' expanded' : '')
      }>
        <div className='taskIndex'>{this.props.taskIndex + 1}</div>
        <div className='collapsedTask'>{this.props.text.split('\n')[0]}</div>
        <textarea
          className='taskTextarea'
          readOnly={!this.props.expanded}
          ref={textarea => {
            if (!this.textarea) {
              this.textarea = ReactDOM.findDOMNode(textarea);
            }
          }}
          value={this.props.text}
          onChange={e => {
            autosize.update(this.textarea);
            this.props.changeTaskText(e.target.value);
          }}
        >
        </textarea>
      </div>)
  }
}

export default Task;