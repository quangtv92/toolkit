/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClassName from '../../prop-types/cssClassName';
import collectionOf from '../../prop-types/collectionOf';
import CONTEXT_TYPES from './ContextTypes';

export default class Sidebar extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: ['off-canvas', 'sidebar']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClassName.isRequired,
        uniqueClassName: cssClassName,
        side: PropTypes.oneOf(['left', 'right']).isRequired,
        onHiding: collectionOf.func,
        onHidden: collectionOf.func,
        onShowing: collectionOf.func,
        onShown: collectionOf.func
    };

    state = {
        expanded: false
    };

    /**
     * Verify the `expanded` state.
     *
     * @param {Object} props
     * @param {Object} context
     */
    constructor(props, context) {
        super();

        /* eslint react/no-direct-mutation-state: 0 */
        this.state.expanded = context.isSideActive(props.side);
    }

    /**
     * Determine whether the sidebar is expanded or not.
     *
     * @param {Object} nextProps
     * @param {Object} nextContext
     */
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            expanded: nextContext.isSideActive(nextProps.side)
        });
    }

    /**
     * Only update if the expanded state is different.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.expanded !== this.state.expanded);
    }

    /**
     * Emit `showing` or `hiding` events before rendering.
     */
    componentWillUpdate() {
        this.emitEvent(this.state.expanded ? 'hiding' : 'showing');
    }

    /**
     * Emit `shown` or `hidden` events after rendering.
     */
    componentDidUpdate() {
        this.emitEvent(this.state.expanded ? 'shown' : 'hidden');
    }

    /**
     * Render the off canvas sidebar.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            expanded = this.state.expanded;

        return (
            <aside
                role="complementary"
                className={this.formatClass(props.className, {
                    ['@' + props.side]: true,
                    'is-expanded': expanded
                })}
                aria-hidden={!expanded}
                aria-expanded={expanded}
                data-offcanvas-sidebar={props.side}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </aside>
        );
    }
}