/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {PropTypes} from 'react';
import cx from 'classnames';
import Header from './Header';
import Footer from '../Footer';
import s from './Layout.css';

class Layout extends React.Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        className: PropTypes.string,
    };

    componentDidMount() {
        window.componentHandler.upgradeElement(this.root);
    }

    componentWillUnmount() {
        window.componentHandler.downgradeElements(this.root);
    }

    render() {
        /*
        fmr-ref-0: mdl-layout mdl-js-layout
        fmr-ref-1: mdl-layout__inner-container
        fmr-ref-2: mdl-layout__content
        */
        return (
            <div className="fmr-ref-0" ref={node => (this.root = node)}>
                <div className="fmr-ref-1">
                    <Header />
                    <main className="fmr-ref-2">
                        <div {...this.props}
                             className={cx(s.content, this.props.className)}/>
                        <Footer />
                    </main>
                </div>
            </div>
        );
    }
}

export default Layout;
