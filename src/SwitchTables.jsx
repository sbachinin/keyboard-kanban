import React, { Component } from 'react';

export default class SwitchTables extends Component {

  state = {
    chosenTableIndex: 0
  }

  componentWillMount() {
    document.addEventListener('keyup', e => {
      const {chosenTableIndex} = this.state;
      if (!this.props.switchSelected) return;
      if (e.which === 38 && chosenTableIndex > 0) {
        this.setState({ chosenTableIndex: chosenTableIndex - 1 });
      }
      if (e.which === 40 && chosenTableIndex < this.state.otherTables.length - 1) {
        this.setState({ chosenTableIndex: chosenTableIndex + 1 })
      }
      if (e.which === 13) {
        const tableId = this.state.otherTables[this.state.chosenTableIndex].id;
        this.setState({ chosenTableIndex: 0 });
        this.props.switchToTable(tableId);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    // when entered this select, take all inactive tabs from localStorage
    if (!this.props.switchSelected && nextProps.switchSelected) {
      const otherTables = Object.keys(localStorage)
      .filter(key => key !== 'activeTableId')
      .map(storageKey => {
        return {
          id: storageKey,
          tableName: JSON.parse(localStorage.getItem(storageKey)).tableName
        };
      })
      .filter(table => table.tableName !== this.props.activeTableName);
      this.setState({otherTables});
    }
  }

  render() {
    return (
      <div className='otherTables'>
        {
          this.props.switchSelected ? (
            <div>
              {
                this.state.otherTables.length > 0 ? (
                  this.state.otherTables.map((table, i) => {
                    return (
                      <div className={
                        'option ' + (this.state.chosenTableIndex === i ? 'chosen' : '')
                      } key={i}>
                        {table.tableName}
                      </div>
                    )
                  })
                ) : <div className='option'>no other tables</div>
              }
            </div>
          ) : <span>Switch to another table</span>
        }
      </div>
    );
  }

}