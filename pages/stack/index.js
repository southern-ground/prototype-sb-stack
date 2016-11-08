/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import _ from '../../node_modules/lodash';
import React from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import {title, html} from './index.md';
import history from '../../core/history';
import store from '../../core/store';
import StackItem from '../../components/StackItem/StackItem';
import Sortable from 'sortablejs';
import {UPDATE_INVENTORY, REMOVE_ITEM} from "../../core/action-types";
import NumericLabel from "../../components/Layout/NumericLabel";
import DetailsItem from "../../components/Layout/DetailsItem";

class StackPage extends React.Component {

    constructor(props) {
        super(props);
        this.orderUpdate = this.orderUpdate.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.removeInventoryItem = this.removeInventoryItem.bind(this);
        this.updateProps = this.updateProps.bind(this);
        this.backClick = this.backClick.bind(this);
        this.state = {
            inventory: store.getState().stack,
            enoughSelected: store.getState().stack.length > 2,
            showDetails: false,
            stackOrder: []
        };
    }

    componentDidMount() {
        store.subscribe(this.updateProps);
    }

    updateProps() {
        var newState = store.getState();
        this.setState({
            ...this.state,
            inventory: newState.stack,
            enoughSelected: newState.stack.length > 2
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

        var newOrder = [];

        for (var i = 0; i < e.from.children.length; i++) {
            newOrder.push(e.from.children[i].getAttribute('data-sku'));
        }

        var inventory = this.state.inventory.map(item=>{
            newOrder.map((newOrderItem, index)=>{
                if(newOrderItem === item.sku){
                    item.stackOrder = index;
                }
                return newOrderItem;
            });
            return item;
        });

        inventory = _.sortBy(inventory, 'stackOrder');

        this.setState({
            alternateInventory: inventory,
            stackOrder: newOrder
        });


    }

    backClick() {

        var newInventory = this.state.alternateInventory || this.state.inventory;

        store.dispatch({
            type: UPDATE_INVENTORY,
            items: newInventory
        });

        history.push({pathname: "/"});
    }

    toggleDetails() {
        this.setState({
            showDetails: !this.state.showDetails
        })
    }

    removeInventoryItem(e) {

        e.preventDefault();

        store.dispatch({
            type: REMOVE_ITEM,
            sku: e.target.getAttribute('data-sku')
        });

    }

    render() {

        if (!this.state.enoughSelected) {
            history.push({pathname: "/"});
            return <div/>
        }

        var totalCost = 0,
            currencyParams = {
                justification: 'L',
                currency: true,
                currencyIndicator: 'USD',
                percentage: false,
                precision: 2,
                commafy: true
            };

        this.state.inventory.map(item=> {
            totalCost += item.price;
        });


        return <Layout className={s.content + " " + s.stackContainer}>

            <div className={s.stackTop}>
                <h2>Your Stack</h2>
                <button className={s.button + " " + s.backButton} onClick={this.backClick}>Back</button>
            </div>

            <div className={s.instructions}>
                Drag to Rearrange
            </div>

            <div className={s.stackWrapper + " sortable"} ref={this.sortableContainersDecorator}>

                {this.state.inventory.map((item, index)=> {

                    return <StackItem
                        className="stack-item"
                        image={item.image}
                        sku={item.sku}
                        stackOrder={item.stackOrder || index}
                        key={'stackItem-' + index}
                    />

                })}

            </div>

            <div className={s.stackDetailsWrapper}>

                <button
                    className={s.stackDetailsButton + " " + s.button + " " + (this.state.showDetails ? s.buttonActive : "")}
                    onClick={this.toggleDetails}>Details
                </button>

                <div className={s.stackDetails + " " + (this.state.showDetails ? s.stackDetailsVisible : "")}>

                    <DetailsItem
                        name="Name"
                        sku="SKU"
                        quanity="QTY"
                        price="Price"
                        isHR={true}
                    />

                    {this.state.inventory.map((item, index)=>{
                        return (
                            <DetailsItem
                                name={item.name}
                                sku={item.sku}
                                quanity={item.quantity || 1}
                                price={item.price}
                                key={'itemDetail-' + index}
                            />
                        );
                    })}

                    <DetailsItem
                        price={totalCost}
                        isTotal={true}
                    />


                </div>

            </div>


        </Layout>;
    }

}

export default StackPage;
