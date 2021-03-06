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
import {
    UPDATE_INVENTORY,
    REMOVE_ITEM,
    TOGGLE_ITEM,
    GET_PRICE,
    ADD_TO_CART,
    SET_STACK_ORDER
} from "../../core/action-types";
import {
    NUM_SELECTED_REQUIRED
} from "../../core/constants";
import DetailsItem from "../../components/Layout/DetailsItem";

class StackPage extends React.Component {

    constructor(props) {

        super(props);

        this.orderUpdate = this.orderUpdate.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.removeInventoryItem = this.removeInventoryItem.bind(this);
        this.updateProps = this.updateProps.bind(this);
        this.backClick = this.backClick.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.checkOut = this.checkOut.bind(this);
        this.updateTwitter = this.updateTwitter.bind(this);

        this.state = {
            inventory: [],
            enoughSelected: true,
            showDetails: false,
            processingStoreRequest: false,
            urlCart: ''
        };

    }

    componentWillMount() {

        this.unsubscribeFunction = store.subscribe(this.updateProps);

    }

    componentDidMount() {

        this.updateProps();

        var findPos = (obj) => {
            var curtop = 0;
            if (obj.offsetParent) {
                do {
                    curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
                return [curtop];
            }
        };

        window.scroll(0, findPos(document.getElementById("container")));

    }

    componentWillUnmount() {

        this.unsubscribeFunction();

    }

    updateProps() {

        var newState = store.getState(),
            localizedInventory = newState.inventory
                .filter((item) => {
                    return item.selected;
                })
                .sort((a, b) => {
                    if (a.stackOrder > b.stackOrder) {
                        return 1;
                    }
                    return -1;
                });

        this.setState({
            ...this.state,
            inventory: localizedInventory,
            enoughSelected: localizedInventory.length >= NUM_SELECTED_REQUIRED,
            processingStoreRequest: newState.processingStoreRequest || false,
            urlCart: newState.urlCart || ''
        });

        // clearTimeout(this.twitterTimeout);

        // this.twitterTimeout = setTimeout(this.updateTwitter, 5000);

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

        var els = ((htmlCollection) => {
                let a = [], i = 0;
                for (i; i < htmlCollection.length; i++) {
                    a.push(htmlCollection[i]);
                }
                return a;
            })(e.to.children),
            newOrder = els.map((item) => {
                return item.getAttribute('data-sku');
            }),
            reorderedInventory = this.state.inventory.map((item) => {
                item.stackOrder = _.findIndex(newOrder, (sku) => {
                        return sku === item.sku;
                    }) || 0;
                return item;
            });

        store.dispatch({type: SET_STACK_ORDER, data: reorderedInventory});

    }

    backClick() {

        var newInventory = this.state.alternateInventory || this.state.inventory;

        store.dispatch({
            type: UPDATE_INVENTORY,
            items: newInventory
        });

        history.push({pathname: "/stack"});

    }

    addToCart() {

        store.dispatch(
            {
                type: ADD_TO_CART
            }
        );

    }

    checkOut() {

        window.location = this.state.urlCart;

    }

    toggleDetails() {

        if (!this.state.showDetails) {
            store.dispatch({
                type: GET_PRICE
            });
        }

        this.setState({
            showDetails: !this.state.showDetails
        });

    }

    removeInventoryItem(e) {

        e.preventDefault();

        store.dispatch({
            type: TOGGLE_ITEM,
            sku: e.target.getAttribute('data-sku')
        });

    }

    updateTwitter(){
        window.twttr = (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);
            t._e = [];
            t.ready = function (f) {
                t._e.push(f);
            };
            return t;
        }(document, "script", "twitter-wjs"))
    }

    render() {

        var totalCost = 0,
            skus = this.state.inventory
                .filter((item) => {
                    return item.selected
                })
                .map((item) => {
                    return item.sku;
                })
                .join('_'),
            shareURL = "http://www.shellybrown.com/ss/ref=" + skus,
            twitterURL = encodeURI("I just built a Shelly Brown stack, and it's A-MAZ-ING! " + shareURL);

        if (!this.state.enoughSelected) {
            history.push({pathname: "/stack"});
            return <div/>
        }

        this.state.inventory.map(item => {
            totalCost += item.price;
        });

        return <Layout className={s.content + " " + s.stackContainer}>

            <div id="fb-root"></div>

            <div className={s.stackTop}>
                <h2>Your Stack</h2>
            </div>

            <button className={s.button + " " + s.backButton} onClick={this.backClick}>Back</button>

            <div className={s.instructions}>
                Drag to Rearrange
            </div>

            <div className={s.stackWrapper + " sortable"} ref={this.sortableContainersDecorator}>

                {this.state.inventory.map(item => {
                    return <StackItem
                        className="stack-item"
                        image={item.image}
                        sku={item.sku}
                        key={'stackItem-' + item.sku}
                    />
                })}

                {}

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

                    {this.state.inventory.map((item, index) => {
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

            <div className={s.cartNavigation}>

                <button
                    className={s.stackAddToCartButton + " " + s.button}
                    disabled={this.state.processingStoreRequest}
                    onClick={this.addToCart}>Buy Now
                </button>

                <div className={s.socialButton}>
                    <iframe
                        src={"https://www.facebook.com/plugins/share_button.php?href=http%3A%2F%2Fwww.shellybrown.com%2Fss%2Fref%3D" + skus + "&layout=button&size=small&mobile_iframe=true&appId=175518545791503&width=59&height=20"}
                        width="59" height="20" scrolling="no" frameBorder="0" allowTransparency="true">
                    </iframe>
                </div>
                <div className={s.socialButton}>
                    <a className={s.twitterShareButton}
                       href={"https://twitter.com/intent/tweet?text=" + twitterURL}
                       data-size="small"><i className={s.twitterIcon}></i> Tweet
                        </a>
                </div>

            </div>


        </Layout>
            ;
    }

}

export default StackPage;
