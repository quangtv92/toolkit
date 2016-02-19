/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';

export default class Item extends Component {
    static defaultProps = {
        className: ['breadcrumb', 'item'],
        caret: '/'
    };

    static propTypes = {
        children: PropTypes.node.isRequired,
        className: cssClass.isRequired,
        caret: PropTypes.node
    };

    /**
     * Render the breadcrumb item link.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <li>
                <a className={this.formatClass(props.className)}
                    {...this.inheritNativeProps(props)}>
                    {props.children}
                    <span className="caret">{props.caret}</span>
                </a>
            </li>
        );
    }
}
