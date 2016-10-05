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
import Layout from '../../components/Layout';
import s from './styles.css';
import {title, html} from './index.md';
import Link from '../../components/Link';
import store from '../../core/store';

class HomePage extends React.Component {

    componentDidMount() {
        document.title = title;
    }

    render() {
        return (
            <Layout className={s.sectionColumn}>

                <div className={s.sectionTop}>
                    <h2>Build Your Stack</h2>
                </div>

                <div className={s.sectionBottom}>
                    Click&nbsp;<Link className="" to="/choose"> here </Link>&nbsp;to get started.
                </div>

            </Layout>
        );
    }

}

export default HomePage;
