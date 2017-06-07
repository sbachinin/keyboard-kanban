import React, { Component } from 'react';
import PropTypes from 'prop-types';
// отображает название колонки (по умалочанию ее номер)
// позволяет менять название
// позволяет удалять колонку
// позволяет добавлять (просить App добавить) соседние колонки

class ColumnHeader extends Component {

  componentWillUpdate(nextProps, nextState) {
    if (!this.props.columnTitleIsEdited && nextProps.columnTitleIsEdited) {
      setTimeout(() => {
        this.titleInput.focus();
      });
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
        {
          this.props.headerActive ? (
            <div className='activeHeaderContents'>
              <span className={
                'addColumn left' +
                (this.props.activeItemIndex === 0 ? ' active' :  '')
              }>+</span>
              {
                this.props.columnTitleIsEdited ? (
                  <input
                    className='titleInput'
                    type='text'
                    value={this.props.columnTitle}
                    ref={comp => {
                      this.titleInput = comp;
                    }}
                    onChange={e => {
                      this.context.dispatcher.fireAction(
                        'updateColumnTitle', { newTitle: e.target.value });
                    }}
                  />
                ) : (
                  <span className={
                    'nonEditableTitle' +
                    (this.props.activeItemIndex === 1 ? ' active' :  '')
                  }>
                    {this.props.columnTitle || '...'}
                  </span>
                )
              }
              <span className={'deleteColumn' + (this.props.activeItemIndex === 2 ? ' active' :  '')}>
                <svg fill="#000000" height="17" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </span>
              <span className={'addColumn right' + (this.props.activeItemIndex === 3 ? ' active' :  '')}>+</span>
            </div>
          ) : <span className='nonEditableTitle'>{this.props.columnTitle || '...'}</span>
        }
      </div>
    )
  }
}

ColumnHeader.contextTypes = {
  dispatcher: PropTypes.object
};

export default ColumnHeader;
