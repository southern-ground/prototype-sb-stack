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
import StackItem from '../../components/StackItem/StackItem';
import Sortable from 'sortablejs';
import {UPDATE_INVENTORY, REMOVE_ITEM} from "../../core/action-types";
import NumericLabel from "../../components/NumericLabel";

class StackPage extends React.Component {

    constructor(props) {
        super(props);
        this.orderUpdate = this.orderUpdate.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.removeInventoryItem = this.removeInventoryItem.bind(this);
        this.updateProps = this.updateProps.bind(this);
    }

    componentWillMount() {
        document.title = title;
        this.state = {
            inventory: store.getState().stack,
            enoughSelected: store.getState().stack.length > 2,
            showDetails: false
        };
        store.subscribe(this.updateProps);
    }

    updateProps() {
        this.setState({
            inventory: store.getState().stack,
            enoughSelected: store.getState().stack.length > 2,
            showDetails: this.state.showDetails
        });

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

    orderUpdate(e) {

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

    removeInventoryItem(e) {

        e.preventDefault();

        store.dispatch({
            type: REMOVE_ITEM,
            sku: e.target.getAttribute('data-sku')
        });

    }

    toggleDetails() {
        this.setState({
            showDetails: !this.state.showDetails
        })
    }

    renderError() {
        history.push({pathname: "/choose"});
        return <div/>
    }

    renderStack() {

        var totalCost = 0,
            currencyParams = {
                justification: 'L',
                currency: true,
                currencyIndicator: 'USD',
                percentage: false,
                precision: 2,
                commafy: true
            };

        this.state.inventory.map((item)=> {
            totalCost += item.price;
        });

        return <div className={s.stackContainer}>

            <div className={s.stackTop}>
                <h2>Your Stack</h2>
                <button className={s.button + " " + s.backButton} onClick={this.backClick}>Back</button>
            </div>

            <div className={s.instructions}>
                Drag to Rearrange
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

            <div className={s.stackDetailsWrapper}>
                <button
                    className={s.stackDetailsButton + " " + s.button + " " + (this.state.showDetails ? s.buttonActive : "")}
                    onClick={this.toggleDetails}>Details
                </button>
                <div className={s.stackDetails + " " + (this.state.showDetails ? s.stackDetailsVisible : "")}>

                    {/*<div className={s.flexRow}>
                        <div><span className={s.tableHeader}>Name</span></div>
                        <div><span className={s.tableHeader}>SKU</span></div>
                        <div><span className={s.tableHeader}>QTY</span></div>
                        <div><span className={s.tableHeader}>Price</span></div>
                        <div><span>&nbsp;</span></div>
                    </div>

                    {this.state.inventory.map((item, index) => {
                        return <div className={s.flexRow + " " + s.flexRowItem} key={'item-' + item.sku + '-' + index}>
                            <div>{item.name}</div>
                            <div>{item.sku}</div>
                            <div className={s.detailCenter}>1</div>
                            <div><NumericLabel
                                params={currencyParams}>{item.price}</NumericLabel></div>
                            <div className={s.detailCenter}>
                                <a href="#"
                                   className={s.removeInventoryItem}
                                   data-sku={item.sku}
                                   onClick={this.removeInventoryItem}
                                   key={"remove-item-" + item.sku + '-' + index}
                                >Remove</a>
                            </div>
                        </div>
                    })}

                    <div className={s.flexRow}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div className={s.total}><NumericLabel
                            params={currencyParams}>{totalCost}</NumericLabel></div>
                        <div></div>
                    </div>*/}

                    <div className={s.stackDetailsItem}>
                        <span className={s.tableHeader}>Name</span>
                        {this.state.inventory.map((item, index) => {
                            return <div key={'itemName-' + item.sku + '-' + index}>{item.name}</div>
                        })}
                    </div>

                    <div className={s.stackDetailsItem}>
                        <span className={s.tableHeader}>SKU</span>
                        {this.state.inventory.map((item, index)=> {
                            return <div key={'sku-' + item.sku + '-' + index}>{item.sku}</div>
                        })}
                    </div>

                    <div className={s.stackDetailsItem}>
                        <span className={s.tableHeader}>QTY</span>
                        {this.state.inventory.map((item, index)=> {
                            return <div key={'quantity-' + item.sku + '-' + index}>1</div>
                        })}
                    </div>

                    <div className={s.stackDetailsItem}>
                        <span className={s.tableHeader}>Price</span>
                        {this.state.inventory.map((item, index)=> {
                            return <div key={'price-' + item.sku + '-' + index}><NumericLabel
                                key={'price-' + item.sku + '-' + index + "-PRICE"}
                                params={currencyParams}>{item.price}</NumericLabel></div>
                        })}
                        <div className={s.invoiceTotal}>
                            <NumericLabel key={'totalPrice'}
                                          params={currencyParams}>
                                {totalCost}
                            </NumericLabel>
                        </div>
                    </div>

                    <div className={s.stackDetailsItem}>
                        <span>&nbsp;</span>
                        {this.state.inventory.map((item, index) => {
                            return <div><a href="#"
                                           className={s.removeInventoryItem}
                                           data-sku={item.sku}
                                           onClick={this.removeInventoryItem}
                                           key={"remove-item-" + item.sku + '-' + index}
                            >Remove</a></div>
                        })}
                    </div>

                </div>
            </div>
        </div>
    }

    render() {
        return (
            <Layout className={s.content}>
                {this.state.enoughSelected ? this.renderStack() : this.renderError()}
            </Layout>
        );
    }

}

export default StackPage;
