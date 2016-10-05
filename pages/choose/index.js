/**
 * Created by fst on 10/3/16.
 */
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
import InventoryItem from '../../components/InventoryItem/InventoryItem';
import store from '../../core/store';
import history from '../../core/history';

class ChoosePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {inventory: [], selectCount: 0, enableButton: false}
        this.updateProps = this.updateProps.bind(this);
    }

    componentWillMount() {
        store.subscribe(this.updateProps);
        document.title = title;
    }

    componentDidMount(){
        this.updateProps();
    }

    updateProps() {
        console.log('updateProps');
        this.setState({
            inventory: store.getState().inventory,
            stack: store.getState().stack,
            selectCount: store.getState().stack.length,
            enableButton: store.getState().stack.length > 2
        });
    }

    compareClick() {
        history.push({pathname: "/stack"});
    }

    render() {

        console.log(s);

        return (

            <Layout>

                <div className={s.chooseTop}>

                    <h2 className={s.title}>Build Your Stack</h2>

                    <button
                        disabled={!this.state.enableButton}
                        onClick={this.compareClick}
                        className={s.viewButton + " " + (this.state.enableButton ? "" : s.buttonDisabled)}>
                        View
                    </button>

                </div>

                <div className={s.instructions}>
                    Choose at least three
                </div>

                <div className={s.inventoryContainer}>
                    {this.state.inventory.map((item, index)=> {
                        return <InventoryItem
                            state={item}
                            key={'inv-' + item.sku + '-' + index}
                        />
                    })}
                </div>

            </Layout>
        );
    }

}

export default ChoosePage;
