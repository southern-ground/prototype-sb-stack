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

    static propTypes = {
        articles: PropTypes.array.isRequired,
    };

    componentDidMount() {
        document.title = title;
    }

    render() {
        console.log(s);
        return (
            <Layout className="sb-content">

                <h2 className="sb-content--title">Build Your Stack</h2>

                <div>
                    Click <Link className="" to="/choose">here</Link> to get started.
                </div>

                {/*<h4>Articles</h4>
                 <ul>
                 {this.props.articles.map((article, i) =>
                 <li key={i}><a href={article.url}>{article.title}</a> by {article.author}</li>
                 )}
                 </ul>*/}
                <p>
                    <br /><br />
                </p>
            </Layout>
        );
    }

}

export default HomePage;
