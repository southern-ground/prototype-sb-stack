/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import {title, html} from './index.md';
import history from '../../core/history';
import store from '../../core/store';
import Link from '../../components/Link';
import StackItem from '../../components/StackItem/StackItem';
import Sortable from 'sortablejs';
import {UPDATE_INVENTORY} from "../../core/action-types";

class StackPage extends React.Component {

    constructor(props) {
        super(props);
        this.orderUpdate = this.orderUpdate.bind(this);
    }

    componentWillMount() {
        document.title = title;

        this.state = {
            inventory: store.getState().stack,
            enoughSelected: (items=> {
                var count = 0;
                items.forEach(item=> {
                    if (item.selected) count++;
                });
                return count > 2;
            })(store.getState().stack)
        };
    }

    sortableContainersDecorator = (componentBackingInstance) => {
        // check if backing instance not null
        if (componentBackingInstance) {
            let options = {
                draggable: ".stack-item", // Restricts sort start click/touch to the specified element
                group: "stack",
                onUpdate: this.orderUpdate
            };
            Sortable.create(componentBackingInstance, options);
        }
    };

    renderError() {
        return <div className={s.errorText}>
            <h2>Whoops!</h2>
            <p>
                Would you look at that ... nothing to see here. <Link to="/compare">Go</Link>
            </p>
        </div>
    }

    orderUpdate(e) {

        console.log('StackPage::orderUpdate');

        for (var i = 0; i < e.from.children.length; i++) {
            var sku = e.from.children[i].getAttribute('data-sku');
            this.state.inventory.map(item=> {
                if (item.sku === sku) {
                    item.stackOrder = i;
                }
            });
        }

        // Update the order in the store:

        store.dispatch({
            type: UPDATE_INVENTORY,
            items: this.state.inventory
        });
    }

    backClick() {
        history.push({pathname: "/choose"});
    }

    renderStack() {
        return <div className={s.stackContainer}>
            <div dangerouslySetInnerHTML={{__html: html}}/>
            <div>
                To start over you can click the "Home" button in the header (or <Link className="mdl-navigation__link" to="/">here</Link>), or the "Back" button below.
            </div>
            <div className={s.stackWrapper + " sortable"} ref={this.sortableContainersDecorator}>
                {this.state.inventory.map((item, index)=> {

                    if (item.selected) {
                        return <StackItem
                            className="stack-item"
                            state={item}
                            key={'stack-item-' + index}
                            stackOrder={index}
                        />
                    }

                })}
            </div>
            <div>
                <button onClick={this.backClick}>Back</button>
            </div>
        </div>
    }

    render() {
        return (
            <Layout className={s.content}>
                <h1>{title}</h1>
                {this.state.enoughSelected ? this.renderStack() : this.renderError()}
            </Layout>
        );
    }

}

export default StackPage;
