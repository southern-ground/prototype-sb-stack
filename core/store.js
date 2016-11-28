/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {createStore} from 'redux';
import {
    TOGGLE_ITEM,
    SET_INVENTORY,
    UPDATE_INVENTORY,
    REMOVE_ITEM,
    GET_INVENTORY_RESPONSE, GET_INVENTORY_ERROR, GET_INVENTORY,
    GET_PRICE, GET_PRICE_RESPONSE,
    ADD_TO_CART, ADD_TO_CART_RESPONSE, ADD_TO_CART_ERROR,
    CLEAR_ALL_ITEMS
} from '../core/action-types';
import {INVENTORY_IMAGES, SALE_PERCENTAGE, REQUIRED_NUM_SELECTED} from '../core/constants';
import _ from '../node_modules/lodash';
import request from 'superagent';
import Cookies from '../node_modules/js-cookie/src/js.cookie.js';
import history from './history';

const COOKIE_NAME = 'com.shellybrown';

// Centralized application state
// For more information visit http://redux.js.org/

const initialState = {
    inventory: [],
    stack: [],
    selectCount: 0
};

const store = createStore((state = initialState, action) => {
    // TODO: Add action handlers (aka "reduces")

    // console.log('action.type: ' + action.type);

    switch (action.type) {

        case CLEAR_ALL_ITEMS:

            Cookies.set(COOKIE_NAME, {
                    selectedProducts: []
                },
                {
                    expires: 7
                }
            );

            return {
                ...state, inventory: state.inventory.map((item)=> {
                    return {...item, selected: false}
                }), stack: [], enoughSelected: false
            };

        case ADD_TO_CART:

            var URLs = {
                    "bubbleUp": "https://www.shellybrownstore.com/addbysku/index/index?skus=", // URL Provided by BubbleUp (triggers 301 redirect)
                    "redirect": "https://store.shellybrown.com/addbysku/index/index?skus=", // URL Targeted in redirect
                    "internalAPI": "https://www.shellybrownstore.com/api.php?action=addToCart&skus="
                }, url = URLs.redirect,
                productSKUs = state.stack.map((item)=> {
                    return item.sku;
                });

            url += productSKUs.join(',');

            request
                .get(url)
                .withCredentials()
                .end((err, res) => {

                    if (err) {
                        /*
                         in case there is any error, dispatch an action containing the error
                         */
                        console.warn('ADD_TO_CART Error:');
                        console.log(err);
                        store.dispatch({type: ADD_TO_CART_ERROR, err});
                    } else {

                        var response = JSON.parse(res.text);
                        window.location = response.url_cart;

                        /*store.dispatch({
                         type: ADD_TO_CART_RESPONSE,
                         data: JSON.parse(res.text)
                         });
                         */

                    }
                });

            return {...state, processingStoreRequest: true};

        /*
         case ADD_TO_CART_RESPONSE:

         console.log('ADD_TO_CART_RESPONSE', action.data.url_cart);

         return {
         ...state,
         urlCart: action.data.url_cart,
         urlCheckout: action.data.url_checkout
         };
         */

        case GET_PRICE:

            state.stack.map((item)=> {

                if (item.price == 0) {

                    // Is the item currently on sale?
                    var onSale = _.find(item.category_ids, item=> {
                        return item === "74";
                    });

                    request
                        .get('http://shellybrown.com/api.php?action=msrp&productID=' + item.product_id)
                        .end((err, res) => {

                            if (err) {
                                /*
                                 in case there is any error, dispatch an action containing the error
                                 */
                                console.warn('Price Retrieval Error:');
                                console.log(err);

                                store.dispatch({type: GET_INVENTORY_ERROR, err});

                            } else {

                                const data = JSON.parse(res.text);

                                /*
                                 Once data is received, dispatch an action telling the application 
                                 that data was received successfully, along with the parsed data 
                                 */

                                store.dispatch({type: GET_PRICE_RESPONSE, data});
                            }

                        });

                }
            });

            return state;

        case GET_PRICE_RESPONSE:

            var data = action.data.data,
                updateID = data.product_id,
                updatePrice = Number(data.price),
                newInventory,
                newStack;

            if (data.on_sale == 1) {
                updatePrice -= (updatePrice * (SALE_PERCENTAGE / 100));
            }

            newInventory = state.inventory.map((item)=> {
                if (item.product_id === updateID) {
                    item.price = updatePrice;
                }
                return item;
            });

            newStack = state.stack.map((item)=> {
                if (item.product_id === updateID) {
                    item.price = updatePrice;
                }
                return item;
            });

            return {...state, inventory: newInventory, stack: newStack};

        case GET_INVENTORY:

            request
                .get('http://shellybrown.com/api.php?action=inventory')
                .end((err, res) => {
                    if (err) {
                        /*
                         in case there is any error, dispatch an action containing the error
                         */
                        console.warn('GET_INVENTORY Error:');
                        console.log(err);
                        store.dispatch({type: GET_INVENTORY_ERROR, err});
                    } else {
                        const data = JSON.parse(res.text);
                        /*
                         Once data is received, dispatch an action telling the application 
                         that data was received successfully, along with the parsed data 
                         */
                        store.dispatch({type: GET_INVENTORY_RESPONSE, data})
                    }
                });
            return state;

        case GET_INVENTORY_ERROR:

            console.warn('GET_INVENTORY_ERROR');

            return state;

        case GET_INVENTORY_RESPONSE:

            var newInventory = [],
                inventoryItem,
                inventoryMissingImages = [],
                existingInventory = action.data.data,
                savedStack = [],
                cookie = Cookies.get(COOKIE_NAME) ? JSON.parse(Cookies.get(COOKIE_NAME)) : {};

            // Cycle over all the products and look for their associated image:
            existingInventory.map(item=> {

                inventoryItem = INVENTORY_IMAGES.filter(imageItem=>{
                    return imageItem.sku === item.sku;
                }).pop() || null;

                if (inventoryItem) { // We have an image.
                    newInventory.push(Object.assign({selected:false}, item, inventoryItem));

                } else { // No associated image.
                    inventoryMissingImages.push(item);
                }

            });

            // Warn about missing images.
            _.each(inventoryMissingImages, (item)=> {
                console.warn('Image missing for item #' + item.product_id, item.sku, item.name);
            });

            // Filter through the new inventory for previously cookied items:
            _.each(newInventory, (item)=>{
                item.selected = _.find(cookie.selectedProducts, (selectedItem)=>{
                    return item.sku === selectedItem;
                }) ? true : false;
            });

            // TODO: Add flag for shared vs. just cookied?

            // Update the saved stack:
            savedStack = newInventory.filter(item=>{
                return item.selected;
            });

            state = {...state,
                inventory: newInventory,
                stack: savedStack,
                enoughSelected: savedStack.length >= REQUIRED_NUM_SELECTED,
                processingStoreRequest: false,
                urlCart: ''
            };

            if(savedStack.length > 0){

                // Coming from a previous saved state
                // or social share; go to the arrange page

                history.push({pathname: "/arrange"});

                return state;

            }else{
                return state;
            }

        case SET_INVENTORY:

            return {...state, inventory: action.items};

        case TOGGLE_ITEM:

            var stack = [],
                newState = {
                    ...state,
                    inventory: state.inventory.map(item=> {
                        if (item.sku === action.sku) {
                            item.selected = !item.selected;
                        }
                        if (item.selected) {
                            stack.push(item);
                        }
                        return item;
                    }),
                    stack: stack
                };

            newState.inventory.map(item=> {
                if (item.sku === action.sku) {
                    item.stackOrder = newState.stack.length - 1;
                }
            });

            newState.stack.map(item=> {
                if (item.sku === action.sku) {
                    item.stackOrder = newState.stack.length - 1;
                }
            });

            newState.stack = _.sortBy(newState.stack, 'stackOrder');

            newState.enoughSelected = newState.stack.length >= 2;

            newState.processingStoreRequest = false;

            // Clear the reference to the cart if it previously existed.
            // This should re-set the Add to Cart Button.
            newState.urlCart = '';

            Cookies.set(COOKIE_NAME, JSON.stringify({
                    selectedProducts: newState.stack.map(item=> {
                        return item.sku
                    })
                }),
                {
                    expires: 7
                }
            );

            return newState;

        case
        UPDATE_INVENTORY:

            var newStack = action.items,
                newInventory = state.inventory.map(item=> {
                    _.each(newStack, newItem=> {
                        if (newItem.sku === item.sku) {
                            item.stackOrder = newItem.stackOrder;
                        }
                    });
                    return item;
                });

            return {
                ...state,
                inventory: newInventory,
                stack: newStack
            };

        case
        REMOVE_ITEM:

            var newStack = [],
                stackOrderOffset = -1,
                newInventory = state.inventory.map((item, index)=> {

                    if (item.sku === action.sku) {
                        item.selected = false;
                        if (item.stackOrder && item.stackOrder >= 0) {
                            stackOrderOffset = item.stackOrder;
                        }
                    }

                    if (item.selected) {
                        newStack.push(item);
                    }

                    return item;

                });

            newStack = _.sortBy(newStack, 'stackOrder');

            if (stackOrderOffset >= 0) {
                newStack.map((item, index)=> {
                    if (item.stackOrder >= stackOrderOffset) {
                        --item.stackOrder;
                    }
                });
            }

            return {
                ...state,
                inventory: newInventory,
                stack: newStack,
                enoughSelected: newStack.length >= 2
            };

        default:

            return state;

    }
});

export default store;
