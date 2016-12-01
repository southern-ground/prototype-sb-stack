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
    SET_STACK_ORDER,
    UPDATE_INVENTORY,
    GET_INVENTORY_RESPONSE, GET_INVENTORY_ERROR, GET_INVENTORY,
    GET_IMAGE_DATA_RESPONSE, GET_IMAGE_DATA_ERROR,
    GET_PRICE, GET_PRICE_RESPONSE,
    ADD_TO_CART, ADD_TO_CART_ERROR,
    CLEAR_ALL_ITEMS
} from '../core/action-types';
import {
    API_URL,
    BUBBLE_UP_API_URL,
    COOKIE_NAME,
    IMAGE_DATA_URL,
    NUM_SELECTED_REQUIRED,
    SALE_PERCENTAGE
} from '../core/constants';
import _ from '../node_modules/lodash';
import request from 'superagent';
import Cookies from '../node_modules/js-cookie/src/js.cookie.js';
import history from './history';

const initialState = {
    inventory: [],
    stack: []
};

const store = createStore((state = initialState, action) => {

    console.log('store.action', action.type, action);

    const getBlankCookie = (() => {
        // Generates a cookie from a known template.
        return {
            date: new Date().getTime(),
            action: 'n/a',
            selectedProducts: [],
            sharedProducts: [],
            social: false
        };
    });

    const combCookie = ((cookie) => {

        // Cleans a given cookie, adjusting for any previous malfeasances.
        cookie = Object.assign({}, getBlankCookie(), cookie);

        /*

         TODO: Handle any items coming from social share.

         Idea for handling:

         1. IF shared items are defined, comb on order v. SKU.
         2. Update items as selected as needs be.
         3. Blank the share items on toggle/save.

         */

        return cookie;
    });

    const loadCookie = (() => {
        var cookie = Cookies.get(COOKIE_NAME) ? JSON.parse(Cookies.get(COOKIE_NAME)) : getBlankCookie();
        return combCookie(cookie);
    });

    const getCookie = ((settings) => {
        return Object.assign({}, getBlankCookie(), settings);
    });

    const writeCookie = ((settings) => {
        Cookies.set(COOKIE_NAME, getCookie(settings), {expires: 7});
    });

    switch (action.type) {

        case GET_INVENTORY:

            // Let's first get the JSON data of images.
            request
                .get(IMAGE_DATA_URL)
                .end((err, res) => {
                    if (err) {
                        console.warn('GET_INVENTORY Error:', err);
                        store.dispatch({type: GET_IMAGE_DATA_ERROR, err});
                    } else {
                        store.dispatch({type: GET_IMAGE_DATA_RESPONSE, data: JSON.parse(res.text).stackItems || []});
                    }
                });

            return state;

        case GET_IMAGE_DATA_RESPONSE:

            // Retrieved the image data; now get the actual inventory:

            request
                .get(API_URL)
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

            return {...state, imageData: action.data};

        case GET_INVENTORY_RESPONSE:

            var inventoryUpdate = [],
                inventoryMissingImages = [],
                existingInventory = action.data.data,
                cookie = loadCookie(),
                previouslySelectedProducts = cookie.selectedProducts,
                fromShare = cookie.social || false;

            // console.log('Cookie:', cookie);

            existingInventory.map(item => { // Cycle over all the products we have images for looking for matches:

                var imageItem = state.imageData.filter((imageItem => {
                        return imageItem.sku === item.sku;
                    })).pop(),
                    previouslySelectedProduct;

                if (imageItem) {

                    // The item is good; there's an image for it.

                    previouslySelectedProduct = _.find(previouslySelectedProducts, (stackItem)=> {
                            return imageItem.sku === stackItem.sku;
                        }) || {};

                    inventoryUpdate.push(Object.assign({}, item, imageItem, previouslySelectedProduct));

                } else {

                    inventoryMissingImages.push(item);

                }

            });

            _.each(inventoryMissingImages, (item) => {
                console.warn('Image missing for item #' + item.product_id, item.sku, item.name);
            });

            state = {
                ...state,
                inventory: inventoryUpdate,
                processingStoreRequest: false,
                urlCart: ''
            };

            var numSelected = state.inventory.filter((item) => {
                return item.selected;
            }).length;

            if (numSelected >= NUM_SELECTED_REQUIRED) {
                // Coming from a previous saved state
                // or social share; go to the arrange page

                history.push({pathname: "/arrange"});

            }

            return state;

        case TOGGLE_ITEM:

            var numSelected = state.inventory.filter((item) => {
                    return item.selected;
                }).length,
                stackOrderReIndex = -1,
                inventoryUpdate = state.inventory.map((item) => {
                    if (item.sku === action.sku) {

                        // Item to toggle.
                        item.selected = !item.selected;

                        if (item.selected) {
                            // Newly added item; push it to the back of the stack.
                            item.stackOrder = numSelected;
                        } else {
                            // Removed item from the stack; adjust the numbers downwards:
                            stackOrderReIndex = item.stackOrder; // Anything w/a stack order above this needs to be shuffled downwards.
                            item.stackOrder = -1;
                        }
                    }
                    return item;
                });

            if (stackOrderReIndex != -1) {
                // There was an item removed;
                // Cycle through and de-increment any higher stack orders.
                inventoryUpdate.forEach((item) => {
                    if (item.stackOrder > stackOrderReIndex) {
                        --item.stackOrder;
                    }
                });
            }

            writeCookie({
                action: action.type,
                selectedProducts: inventoryUpdate.filter((item) => {
                    return item.selected;
                }),
                sharedProducts: []
            });

            return {...state, inventory: inventoryUpdate};

        case CLEAR_ALL_ITEMS:

            writeCookie({
                action: action.type,
                selectedProducts: []
            });

            return {
                ...state, inventory: state.inventory.map((item) => {
                    return {...item, selected: false}
                }), stack: [], enoughSelected: false
            };

        case ADD_TO_CART:

            var productSKUs = state.stack.map((item) => {
                return item.sku;
            });

            request
                .get(BUBBLE_UP_API_URL + productSKUs.join(','))
                .withCredentials()
                .end((err, res) => {

                    if (err) {

                        // In the HIGHLY unlikely event of an error ...
                        console.warn('ADD_TO_CART Error:');
                        console.log(err);
                        store.dispatch({type: ADD_TO_CART_ERROR, err});

                    } else {

                        var response = JSON.parse(res.text);
                        window.location = response.url_cart;

                    }
                });

            return {...state, processingStoreRequest: true};

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

            newInventory = state.inventory.map((item) => {
                if (item.product_id === updateID) {
                    item.price = updatePrice;
                }
                return item;
            });

            newStack = state.stack.map((item) => {
                if (item.product_id === updateID) {
                    item.price = updatePrice;
                }
                return item;
            });

            return {...state, inventory: newInventory, stack: newStack};

        case GET_INVENTORY_ERROR:

            console.warn('GET_INVENTORY_ERROR');

            return state;

        case SET_INVENTORY:

            return {...state, inventory: action.items};

        case UPDATE_INVENTORY:

            var newStack = action.items,
                newInventory = state.inventory.map(item => {
                    _.each(newStack, newItem => {
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

        case SET_STACK_ORDER:

            var inventoryUpdate = state.inventory.map((item) => {

                var updateItem = _.find(action.data, (itemUpdate) => {
                    return itemUpdate.sku === item.sku
                });

                if (updateItem) {
                    item.stackOrder = updateItem.stackOrder;
                }

                return item;

            });

            writeCookie({
                action: action.type,
                selectedProducts: inventoryUpdate.filter((item) => {
                    return item.selected;
                }),
                sharedProducts: []
            });

            return {
                ...state,
                inventory: inventoryUpdate
            };

        default:

            return state;

    }
});

export default store;
