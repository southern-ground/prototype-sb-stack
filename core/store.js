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
import {TOGGLE_ITEM, SET_INVENTORY, UPDATE_INVENTORY} from '../core/action-types';

// Centralized application state
// For more information visit http://redux.js.org/

const initialState = {
    inventory: [
        {
            "sku": "644DA5F7-41F2-5FD4-88F3-28B2A87EA43B",
            "name": "Vance",
            "background": {
                "red": 27,
                "green": 226,
                "blue": 130
            },
            "selected": false
        },
        {
            "sku": "43E8D8BF-57A1-9586-04FD-68405F70A673",
            "name": "Nicole",
            "background": {
                "red": 149,
                "green": 140,
                "blue": 18
            },
            "selected": false
        },
        {
            "sku": "BB661815-F56C-14ED-158D-2224F76DF1CD",
            "name": "Sloane",
            "background": {
                "red": 153,
                "green": 125,
                "blue": 82
            },
            "selected": false
        },
        {
            "sku": "F7E7FD56-288D-AE73-9A81-4E35699C9726",
            "name": "Patience",
            "background": {
                "red": 203,
                "green": 81,
                "blue": 47
            },
            "selected": false
        },
        {
            "sku": "76E0D8C4-A920-47E7-144F-1DAE96EE949A",
            "name": "Nina",
            "background": {
                "red": 215,
                "green": 50,
                "blue": 127
            },
            "selected": false
        },
        {
            "sku": "43D9DE8D-6162-F51E-2D03-02B9089CC5F3",
            "name": "Wesley",
            "background": {
                "red": 229,
                "green": 35,
                "blue": 121
            },
            "selected": false
        },
        {
            "sku": "16377799-0EE7-7131-816E-182BD5E307B3",
            "name": "Ora",
            "background": {
                "red": 140,
                "green": 139,
                "blue": 53
            },
            "selected": false
        },
        {
            "sku": "70FD95C7-E77B-74FF-59ED-392C9D220FB0",
            "name": "Hiram",
            "background": {
                "red": 106,
                "green": 46,
                "blue": 196
            },
            "selected": false
        },
        {
            "sku": "BCC762B3-6E24-CEA8-C7FC-AB42868E207D",
            "name": "Guinevere",
            "background": {
                "red": 31,
                "green": 199,
                "blue": 124
            },
            "selected": false
        },
        {
            "sku": "164E9783-183C-F0F6-B233-B780209564FA",
            "name": "Petra",
            "background": {
                "red": 233,
                "green": 206,
                "blue": 104
            },
            "selected": false
        }
    ],
    selectCount: 0
};

const store = createStore((state = initialState, action) => {
    // TODO: Add action handlers (aka "reduces")
    switch (action.type) {
        case SET_INVENTORY:
            return {...state, inventory: action.items};
        case TOGGLE_ITEM:
            var selectCount = 0;
            return {
                ...state, inventory: state.inventory.map(item=> {
                    if (item.sku === action.sku) {
                        item.selected = !item.selected;
                    }
                    if (item.selected) selectCount++;
                    return item;
                }), selectCount: selectCount
            };
        case UPDATE_INVENTORY:
            return {
                ...state,
                inventory: action.items.map(item=> {
                    if (!item.selected) {
                        item.stackOrder = -1;
                    }
                    return item;
                }).sort((a, b)=> {

                    if (a.stackOrder > b.stackOrder) {
                        return 1;
                    } else {
                        return -1;
                    }

                })
            };
        default:
            return state;
    }
});

export default store;
