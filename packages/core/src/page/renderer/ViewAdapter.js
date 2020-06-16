import React from 'react';
import memoizeOne from 'memoize-one';
import Context from '../Context';

/**
 * An adapter component providing the current page controller's state to the
 * page view component through its properties.
 */
export default class ViewAdapter extends React.Component {
  static getDerivedStateFromProps(props, state) {
    //we want use props.state only when props changed
    //temp indicator notUsePropsState is set by AbstractPageRenderer
    if (state.notUsePropsState) {
      return Object.assign({}, state, {
        $pageView: props.state.$pageView,
        notUsePropsState: undefined
      });
    }

    return props.state;
  }

  /**
   * Initializes the adapter component.
   *
   * @param {{
   *          state: Object<string, *>,
   *          view: function(new:React.Component, Object<string, *>)
   *        }} props Component properties, containing the actual page view
   *        and the initial page state to pass to the view.
   */
  constructor(props) {
    super(props);

    /**
     * The current page state as provided by the controller.
     *
     * @type {Object<string, *>}
     */
    this.state = props.state;

    /**
     * The actual page view to render.
     *
     * @type {function(new:React.Component, Object<string, *>)}
     */
    this._view = props.view;

    /**
     * The memoized context value.
     *
     * @type {function}
     */
    this._getContextValue = memoizeOne((props, state) =>
      this.getContextValue(props, state)
    );

    /**
     * The array of selectors for context values.
     *
     * @type {Array<function>}
     */
    this.contextSelectors = [props => props.$Utils];

    /**
     * The function for creating context.
     *
     * @type {function}
     */
    this.createContext = memoizeOne($Utils => {
      return { $Utils };
    });
  }

  getContextValue(props, state) {
    const selectedValues = this.contextSelectors.map(selector =>
      selector(props, state)
    );

    return this.createContext(...selectedValues);
  }

  /**
   * @inheritdoc
   */
  render() {
    return React.createElement(
      Context.Provider,
      { value: this._getContextValue(this.props, this.state) },
      React.createElement(this._view, this.state)
    );
  }
}
