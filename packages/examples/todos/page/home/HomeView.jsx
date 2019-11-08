import { PageContext, AbstractComponent } from '@ima/core';
import React from 'react';
import Item from '../../component/item/Item';

export default class HomeView extends AbstractComponent {
  static get contextType() {
    return PageContext;
  }

  render() {
    return (
      <div className="l-home">
        <section className="todoapp">
          <header id="header">
            <h1>{this.localize('home.title')}</h1>
            <input
              className="new-todo"
              placeholder={this.localize('home.new item placeholder')}
              ref={newItemInput => (this.newItemInput = newItemInput)}
              onBlur={this.onItemAdded.bind(this)}
              onKeyUp={this.onKeyUp.bind(this)}
            />
          </header>
          <section className="main">
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              ref={toggleAll => (this.toggleAll = toggleAll)}
              onChange={this.onToggleAll.bind(this)}
              checked={this.props.toggleAllChecked}
            />
            <label htmlFor="toggle-all">
              {this.localize('home.toggle all label')}
            </label>
            <ul className="todo-list">
              {this.props.items.map(item => (
                <Item item={item} key={item.id} $Utils={this.utils} />
              ))}
            </ul>
          </section>
          <footer className="footer">
            <span className="todo-count">
              <strong>
                {this.props.items.filter(item => !item.completed).length}
              </strong>
              {this.localize('home.count', {
                COUNT: this.props.items.filter(item => !item.completed).length
              })}
            </span>
            <ul className="filters">
              <li>
                <a
                  href={this.link('home', {})}
                  className={this.cssClasses({
                    selected: this.props.filter === null
                  })}>
                  {this.localize('home.filters: all')}
                </a>
              </li>
              <li>
                <a
                  href={this.link('filtered', { filter: 'active' })}
                  className={this.cssClasses({
                    selected: this.props.filter === false
                  })}>
                  {this.localize('home.filters: active')}
                </a>
              </li>
              <li>
                <a
                  href={this.link('filtered', { filter: 'completed' })}
                  className={this.cssClasses({
                    selected: this.props.filter === true
                  })}>
                  {this.localize('home.filters: completed')}
                </a>
              </li>
            </ul>
            <button
              onClick={this.onDeleteCompleted.bind(this)}
              className={this.cssClasses({
                'clear-completed': true,
                hidden: this.props.items.every(item => !item.completed)
              })}>
              {this.localize('home.clear completed')}
            </button>
          </footer>
        </section>
        <footer className="info">
          <p>{this.localize('home.info: edit')}</p>
          <p>{this.localize('home.info: created by')}</p>
          <p>
            Part of <a href="http://todomvc.com">TodoMVC</a>
          </p>
        </footer>
      </div>
    );
  }

  componentDidMount() {
    this.newItemInput.focus();
  }

  onKeyUp(event) {
    if (event.keyCode === 13) {
      this.onItemAdded();
    }
  }

  onItemAdded() {
    if (this.newItemInput.value) {
      this.fire('itemCreated', {
        title: this.newItemInput.value
      });
      this.newItemInput.value = '';
    }
  }

  onToggleAll() {
    this.fire('toggleAll', {
      completed: this.toggleAll.checked
    });
  }

  onDeleteCompleted() {
    this.fire('completedItemsDeleted');
  }
}
