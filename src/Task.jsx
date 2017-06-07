import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import autosize from 'autosize';
import PropTypes from 'prop-types';

class Task extends Component {
  
  componentDidMount() {
    autosize(this.textarea);
    if (this.props.expanded) { // task is just created
      setTimeout(() => { this.textarea.focus(); }, 0);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.expanded && nextProps.expanded) {
      setTimeout(() => { autosize.update(this.textarea); this.textarea.focus(); }, 0);
    }
    if (this.props.expanded && !nextProps.expanded) {
      this.textarea.blur();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { text, active, expanded } = this.props;
    if (text !== nextProps.text ||
      active !== nextProps.active ||
      expanded !== nextProps.expanded) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div className={'task' +
        (this.props.active ? ' active' : '') +
        (this.props.expanded ? ' expanded' : '')
      }>
        <div className='taskIndex'>{this.props.taskIndex + 1}</div>
        <div className='collapsedTask'>
          {this.props.text.split('\n')[0]}
          {
            this.props.text.split('\n')[1] ?
            <p className='moreText'>...............................................</p> : null
          }
        </div>
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
            this.context.dispatcher.fireAction('updateTask', { newTask :e.target.value });
          }}
        >
        </textarea>
      </div>)
  }
}

Task.contextTypes = {
  dispatcher: PropTypes.object
};

export default Task;