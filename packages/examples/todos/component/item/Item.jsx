import { AbstractComponent } from '@ima/core';
import React from 'react';

export default class Item extends AbstractComponent {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    };
  }

  render() {
    return (
      <li
        className={this.cssClasses({
          completed: this.props.item.completed,
          editing: this.state.editing
        })}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.item.completed}
            onChange={e => this.onCompletionToggled(e)}
          />
          <label onDoubleClick={e => this.onStartEdit(e)}>
            {this.props.item.title}
          </label>
          <button className="destroy" onClick={e => this.onDelete(e)} />
        </div>
        {this._generateEditUI()}
      </li>
    );
  }

  componentDidUpdate() {
    if (!this.state.editing) {
      return;
    }

    this.edit.focus();
  }

  onDelete() {
    this.fire('itemDeleted', {
      item: this.props.item
    });
  }

  onCompletionToggled() {
    this.fire('itemCompletionToggled', {
      item: this.props.item
    });
  }

  onStartEdit() {
    this.setState({
      editing: true
    });
  }

  onFinishEditing() {
    let newTitle = this.edit.value;

    if (newTitle !== this.props.item.title) {
      this.fire('itemEdited', {
        item: this.props.item,
        newTitle: newTitle
      });
    }

    this.setState({
      editing: false
    });
  }

  _generateEditUI() {
    if (!this.state.editing) {
      return null;
    }

    return (
      <input
        className="edit"
        ref={edit => (this.edit = edit)}
        defaultValue={this.props.item.title}
        onBlur={this.onFinishEditing.bind(this)}
      />
    );
  }
}
