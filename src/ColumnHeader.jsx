import React, { Component } from 'react';

// отображает название колонки (по умалочанию ее номер)
// позволяет менять название
// позволяет удалять колонку
// позволяет добавлять (просить App добавить) соседние колонки

class ColumnHeader extends Component {

  componentWillReceiveProps(nextProps) {
    if (!this.props.headerActive && nextProps.headerActive) {
      setTimeout(() => {this.titleInput.focus();});
    }
  }

  tryChangeTitle(e) {
    if (this.props.headerActive) {
      this.props.changeColumnTitle(e.target.value);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.columnTitle !== nextProps.columnTitle) return true;    
    if (!this.props.headerActive && !nextProps.headerActive) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <div className={
        'columnHeader' + (this.props.headerActive ? ' active' : '')
      }>
      { this.props.headerActive ? (
        <input type='text'
          value={this.props.columnTitle}
          onChange={this.tryChangeTitle.bind(this)}
          ref={comp => {
            this.titleInput = comp;
          }}
        />) : <span className='inactiveTitle'>{this.props.columnTitle || '...'}</span>
      }
      </div>
    )
  }
}

export default ColumnHeader;