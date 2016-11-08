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
    inventoryImages: [
        {
            "sku": "SB-B8BOC",
            "name": "Alexandria - Antique Brass - Crystal",
            "image": "SB-Alexandria-B8BOC.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B8BOP",
            "name": "Alexandria - Antique Brass - Green",
            "image": "SB-Alexandria-B8B0P.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B8BOJ",
            "name": "Alexandria - Antique Brass - Jet",
            "image": "Sb-Alexandria-B8BOJ.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B8BOR",
            "name": "Alexandria - Antique Brass - Pink",
            "image": "SB-Alexandria-B8BOR.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B8SOC",
            "name": "Alexandria - Antique Silver - Crystal",
            "image": "SB-Alexandria-B8SOC.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B8SOM",
            "name": "Alexandria - Antique Silver - Sailor",
            "image": "SB-Alexandria-B8SOM.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B8HT",
            "name": "Alexandria - Hematite - Topaz",
            "image": "SB-Alexandria-B8HT.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B8PGBD",
            "name": "Alexandria - Polished Gold - Smoke",
            "image": "SB-Alexandria-B8PGBD.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B8SOJ",
            "name": "Alexandria - Antique Silver - Jet",
            "image": "SB-Alexandria-B8SOJ.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B8SOLS",
            "name": "Alexandria - Antique Silver - Ocean",
            "image": "SB-Alexandria-B8SOLS.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B8SOBD",
            "name": "Alexandria - Antique Silver - Smoke",
            "image": "SB-Alexandria-B8SOPD.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B8SSOS",
            "name": "Alexandria - Antique Silver - Siam",
            "image": "SB-Alexandria-B8SOS.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B9BOC",
            "name": "Angie - Antique Brass - Crystal",
            "image": "SB-Angie-B9BOC.jpg",
            "price": 135,
            "selected": false
        },
        {
            "sku": "SB-B9HC",
            "name": "Angie - Hematite - Crystal",
            "image": "SB-Angie-B9HC.jpg",
            "price": 135,
            "selected": false
        },
        {
            "sku": "SB-B9PGV",
            "name": "Angie - Polished Gold - Mirrored Pink",
            "image": "SB-Angie-B9PGV.jpg",
            "price": 135,
            "selected": false
        },
        {
            "sku": "SB-B9PGBD",
            "name": "Angie - Polished Gold - Smoke",
            "image": "SB-Angie-B9PGBD.jpg",
            "price": 135,
            "selected": false
        },
        {
            "sku": "SB-B9SOC",
            "name": "Angie - Antique Silver - Crystal",
            "image": "SB-Angie-B9SOC.jpg",
            "price": 135,
            "selected": false
        },
        {
            "sku": "SB-B9SOM",
            "name": "Angie - Antique Silver - Sailor",
            "image": "SB-Angie-B9SOM.jpg",
            "price": 135,
            "selected": false
        },
        {
            "sku": "SB-B9SOS",
            "name": "Angie - Antique Silver - Siam",
            "image": "SB-Angie-B9SOS.jpg",
            "price": 135,
            "selected": false
        },
        {
            "sku": "SB-B9SOBD",
            "name": "Angie - Antique Silver - Black Diamond",
            "image": "SB-Angie-B95OBD.jpg",
            "price": 135,
            "selected": false
        },
        {
            "sku": "SB-B3SOWO",
            "name": "Emily - Antique Silver - Opal",
            "image": "SB-Emily-B35OWO.jpg",
            "price": 125,
            "selected": false
        },
        {
            "sku": "SB-B4SOC",
            "name": "Flock - Antique Silver - Crystal",
            "image": "SB-Flock-B4SOC.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B7BOC",
            "name": "Jessica - Antique Brass - Crystal",
            "image": "SB-Jessica-B7BOC.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B7BOWO",
            "name": "Jessica - Antique Brass - Opal",
            "image": "SB-Jessica-B7BOWO.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B7SOC",
            "name": "Jessica - Antique Silver - Crystal",
            "image": "SB-Jessica-B7SOC.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B7HSM",
            "name": "Jessica - Hematite - Mauve",
            "image": "SB-Jessica-B7HSM.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B7HCSS",
            "name": "Jessica - Hematite - Silver Shade",
            "image": "SB-Jessica-B7HCSS.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B7BOCAP",
            "name": "Jessica - Summer Pink",
            "image": "SB-Jessica-B7HT.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B7PGBD",
            "name": "Jessica - Polished Gold - Smoke",
            "image": "SB-Jessica-B7PGBD.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B7PGWO",
            "name": "Jessica - Polished Gold - White Opal",
            "image": "SB-Jessica-B7PGWO.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B7RMGCLS",
            "name": "Jessica - Roman Gold - Lilac",
            "image": "SB-Jessica-B7RMGCLS.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B7SOM",
            "name": "Jessica - Antique Silver - Sailor",
            "image": "SB-Jessica-B7SOM.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B7SOBD",
            "name": "Jessica - Antique Silver - Black Diamond",
            "image": "SB-Jessica-B75OBD.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B18RMG",
            "name": "Joan - Roman Gold",
            "image": "SB-Joan-B18RMG.jpg",
            "price": 78,
            "selected": false
        },
        {
            "sku": "SB-B18SO",
            "name": "Joan - Antique Silver",
            "image": "SB-Joan-B18SO.jpg",
            "price": 78,
            "selected": false
        },
        {
            "sku": "SB-B13PG",
            "name": "Logo Charm - Polished Gold",
            "image": "SB-Logo Charm-B13PG.jpg",
            "price": 78,
            "selected": false
        },
        {
            "sku": "SB-B13S",
            "name": "Logo Charm - Silver",
            "image": "SB-Logo Charm-B13S.jpg",
            "price": 78,
            "selected": false
        },
        {
            "sku": "SB-B2BO",
            "name": "Logo Bracelet - Antique Brass",
            "image": "SB-Logo-SB-B2BO.jpg",
            "price": 98,
            "selected": false
        },
        {
            "sku": "SB-B2SO",
            "name": "Logo Bracelet - Antique Silver",
            "image": "SB-Logo-B2SO.jpg",
            "price": 98,
            "selected": false
        },
        {
            "sku": "SB-B2PG-2",
            "name": "Logo Bracelet - Polished Gold",
            "image": "SB-Logo-B2PG.jpg",
            "price": 98,
            "selected": false
        },
        {
            "sku": "SB-B2PG",
            "name": "Logo Bracelet - Polished Gold",
            "image": "SB-Logo-B2PG 3.jpg",
            "price": 98,
            "selected": false
        },
        {
            "sku": "SB-B2S",
            "name": "Logo Bracelet - Silver",
            "image": "SB-Logo-B2S.jpg",
            "price": 98,
            "selected": false
        },
        {
            "sku": "SB-B17GRTE",
            "name": "Mary - Gold - Red Tiger's Eye",
            "image": "SB-Mary-B17GRTE.jpg",
            "price": 110,
            "selected": false
        },
        {
            "sku": "SB-B17SWH",
            "name": "Mary - Silver - White Howlite",
            "image": "SB-Mary-B17WH.jpg",
            "price": 110,
            "selected": false
        },
        {
            "sku": "SB-B16SO",
            "name": "Peek - Antique Silver",
            "image": "SB-Peek-B16PG.jpg",
            "price": 145,
            "selected": false
        },
        {
            "sku": "SB-B16PG",
            "name": "Peek - Polished Gold",
            "image": "SB-Peek-B16SO.jpg",
            "price": 145,
            "selected": false
        },
        {
            "sku": "SB-B10PG",
            "name": "Penelope - Polished Gold",
            "image": "SB-Penelope-B10PG.jpg",
            "price": 98,
            "selected": false
        },
        {
            "sku": "SB-B1OBOWOM",
            "name": "Protector - Antique Brass - Mystique",
            "image": "SB-Protector-B1OBOWOM.jpg",
            "price": 135,
            "selected": false
        },
        {
            "sku": "SB-B1OSOCO",
            "name": "Protector - Antique Silver - Mermaid",
            "image": "SB-Protector-B1OSOCO.jpg",
            "price": 135,
            "selected": false
        },
        {
            "sku": "SB-B1SORWO",
            "name": "Protector - Antique Brass - Rose Water Opal",
            "image": "SB-Protector-B1SORWO.jpg",
            "price": 135,
            "selected": false
        }
    ],
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
