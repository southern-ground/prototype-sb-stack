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
    GET_INVENTORY_RESPONSE,
    GET_INVENTORY_ERROR,
    GET_INVENTORY
} from '../core/action-types';
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
        case GET_INVENTORY:
            console.log('GET_INVENTORY');
            request
                .get('http://shellybrown.com/api.php?action=inventory')
                .end((err, res) => {
                    console.log('request:end');
                    if (err) {
                        /*
                         in case there is any error, dispatch an action containing the error
                         */
                        console.log('err:');
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
            console.log('GET_INVENTORY_ERROR');

            return state;
        case GET_INVENTORY_RESPONSE:
            console.log('GET_INVENTORY_RESPONSE');

            var newInventory = [];

            action.data.data.map(function(item){
                console.log(item.sku);
                var match = _.find(state.inventoryImages, (inventoryItem)=>{ 
                    return inventoryItem.sku === item.sku; 
                });
                if(match){
                    newInventory.push(match);
                }
            });

            console.log(newInventory);

            var newState = {
                ...state, inventory: newInventory, stack: []
            };

            return newState;

        case SET_INVENTORY:
            return {...state, inventory: action.items};
        case TOGGLE_ITEM:
            var stack = [];
            var newState = {
                ...state, inventory: state.inventory.map(item=> {
                    if (item.sku === action.sku) {
                        item.selected = !item.selected;
                    }
                    if (item.selected) {
                        stack.push(item);
                    }
                    return item;
                }), stack: stack
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

            return newState;

        case UPDATE_INVENTORY:

            console.log('updateInventory');

            var newStack = action.items;
            var newInventory = state.inventory;

            newInventory = newInventory.map(item=> {
                newStack.map(stack=> {
                    if (stack.sku === item.sku) {
                        item.stackOrder = stack.stackOrder;
                    }
                });
                return item;
            });

            console.log(newInventory);

            return {
                ...state,
                inventory: newInventory,
                stack: newStack
            };

        case REMOVE_ITEM:

            var newStack = [];
            var stackOrderOffset = -1;
            var newInventory = state.inventory.map((item, index)=> {
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
                stack: newStack
            };
        default:
            return state;
    }
});

export default store;
