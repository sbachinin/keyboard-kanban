import React, { Component } from 'react';
import SwitchTables from './SwitchTables';
import shortId from 'shortid';
import _ from 'lodash';

const items = ['name', 'switch', 'add'];

export default class TaskList extends Component {
  
  state = {
    selectedItem: '',
    newTableInputShown: false
  }

  componentWillMount() {
    document.addEventListener('keyup', e => {
      if (!this.props.tablesActive) return;
      const currentItemIndex = items.indexOf(this.state.selectedItem);
      if (e.which === 37 && currentItemIndex > 0 &&
        !this.state.newTableInputShown) {
        this.setState({ selectedItem: (items[currentItemIndex - 1]) });
      }
      if (e.which === 39 && currentItemIndex < 2) {
        this.setState({ selectedItem: (items[currentItemIndex + 1]) });
      }
      if (e.which === 13 && currentItemIndex === 2 && !this.state.newTableInputShown) {
        this.setState({
          newTableInputShown: true
        });
        setTimeout(() => { if (this.newTableInput) this.newTableInput.focus();});
      }
      if (e.which === 27) { // esc
        this.setState({
          newTableInputShown: false
        });
      }
      if (e.which === 40 && this.state.selectedItem !== 'switch') { // down
        setTimeout(_ => { this.props.returnToColumns(); });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.tablesActive && nextProps.tablesActive) {
      this.setState({ selectedItem: 'name' });
    }
    if (this.props.tablesActive && !nextProps.tablesActive) {
      this.setState({ selectedItem: '', newTableInputShown: false });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.selectedItem !== 'name' && nextState.selectedItem === 'name') {
      this.nameInput.focus();
    }
    if (this.state.selectedItem === 'name' && nextState.selectedItem !== 'name') {
      this.nameInput.blur();
    }
  }

  changeTableName(e) {
    this.props.changeTableName(e.target.value);
  }

  trySubmitNewTable(e) {
    if (e.which === 13) {
      const id = shortId.generate();
      localStorage.setItem(id, JSON.stringify({
        tableName: e.target.value,
        columns: _.range(5).map(i => { return { tasks: [] } })
      }));
      this.props.switchToTable(id);
    }
  }

  render() {
    const nameSelected = this.state.selectedItem === 'name';
    const switchSelected = this.state.selectedItem === 'switch';
    const addSelected = this.state.selectedItem === 'add';
    return (
      <div className='tables'>
        <div className={
          'tableName ' + (nameSelected ? 'selected' : '')
        }>
          Table:
          <input type='text' readOnly={!nameSelected} value={this.props.tableName}
            onChange={this.changeTableName.bind(this)}
            ref={comp => {this.nameInput = comp;}}
          />
        </div>
        <SwitchTables
          switchToTable={this.props.switchToTable}
          switchSelected={switchSelected}
          activeTableName={this.props.tableName}
        />
        {
          this.state.newTableInputShown ? (
            <input
              className='newTableInput'
              ref={comp => { this.newTableInput = comp; }}
              type='text' placeholder='Enter new name'
              onKeyUp={this.trySubmitNewTable.bind(this)}
            />
          ) : (
            <div className={
              'addTable ' + (addSelected ? 'selected' : '')
            }>Create new table</div>
          )
        }
      </div>
    )
  }
}
