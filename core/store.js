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
    GET_PRICE, GET_PRICE_RESPONSE
} from '../core/action-types';
import { INVENTORY_IMAGES, SALE_PERCENTAGE } from '../core/constants';
import _ from '../node_modules/lodash';
import request from 'superagent';

// Centralized application state
// For more information visit http://redux.js.org/

const initialState = {
    inventory: [],
    stack: [],
    selectCount: 0
};

const store = createStore((state = initialState, action) => {
    // TODO: Add action handlers (aka "reduces")
    switch (action.type) {
        case GET_PRICE:

            state.stack.map((item)=> {

                if (item.price == 0) {

                    // Is the item currently on sale?
                    var onSale = _.find(item.category_ids, item=>{
                        return item==="74";
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

            var updateID = action.data.data.product_id,
                updatePrice = Number(action.data.data.price);


            if(action.data.data.on_sale == 1){
                updatePrice -= (updatePrice * (SALE_PERCENTAGE / 100));
                // console.log('product id:',updateID, 'sale price:',updatePrice);
            }else{
                // console.log('product id:',updateID, 'msrp:', updatePrice);
            }


            var newInventory = state.inventory.map((item)=> {
                if (item.product_id === updateID) {
                    item.price = updatePrice;
                }
                return item;
            });

            var newStack = state.stack.map((item)=> {
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
                inventoryMissingImages = [],
                existingInventory = action.data.data,
                itemFound = false,
                i;

            // Cycle over all the products we have images for looking for matches:

            existingInventory.map(item=>{

                itemFound = false;

                for(i = 0; i < INVENTORY_IMAGES.length; i++){

                    if(INVENTORY_IMAGES[i].sku == item.sku){
                        itemFound = true;
                        break;
                    }
                }

                if(itemFound){
                    newInventory.push(Object.assign({}, item, INVENTORY_IMAGES[i]));
                }else{
                    inventoryMissingImages.push(Object.assign({}, item, INVENTORY_IMAGES[i]));
                }

            });

            console.log('Existing real inventory');
            console.log(existingInventory);

            _.each(inventoryMissingImages, (item)=>{
                console.warn('Not Found:', item.product_id, item.sku, item.name);
            });

            /*
            INVENTORY_IMAGES.map(item=>{

                itemFound = false;

                for(i = 0; i < existingInventory.length; i++){
                    if(existingInventory[i].sku == item.sku){
                        itemFound = true;
                        break;
                    }
                }

                if(itemFound) {
                    newInventory.push(Object.assign({}, existingInventory[i], item));
                }else{
                    inventoryMissingImages.push(Object.assign({}, existingInventory[i], item));
                }

            });

            _.each(inventoryMissingImages, (item)=>{
                console.warn('Not Found:', item.product_id, item.sku, item.name);
            });
            */

            return {...state, inventory: newInventory, stack: []};

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

            return newState;

        case UPDATE_INVENTORY:

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

        case REMOVE_ITEM:

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
