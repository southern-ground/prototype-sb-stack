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
            "sku": "SB-B9PGV",
            "name": "Angie - Polished Gold - Mirrored Pink",
            "image": "SB-Angie-B9PGV.jpg",
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
            "sku": "SB-B9BOC",
            "name": "Angie - Antique Brass - Crystal (SB-B9BOC?)",
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
            "sku": "SB-B7BOCHP",
            "name": "Jessica - (SB-B7BOCHP?)",
            "image": "SB-Jessica-B7BOCHP.jpg",
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
            "sku": "SB-B7HSM",
            "name": "Jessica - Hematite - Mauve",
            "image": "SB-Jessica-B7HSM.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B7HT",
            "name": "Jessica - Hematite - Topaz",
            "image": "SB-Jessica-B7HT.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B7PGV",
            "name": "Jessica - (SB-B7PGV?)",
            "image": "SB-Jessica-B7PGV.jpg",
            "price": 115,
            "selected": false
        },
        {
            "sku": "SB-B7PGWO",
            "name": "Jessica - (SB-B7PGWO?)",
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
            "sku": "SB-B75OBD",
            "name": "Jessica - (SB-B75OBD?)",
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
            "sku": "SB-B1S3",
            "name": "Logo Charm - (Silver SB-B1S3?)",
            "image": "SB-Logo Charm-B1S3.jpg",
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
            "sku": "SB-B2PG",
            "name": "Logo Bracelet - Polished Gold",
            "image": "SB-Logo-B2PG.jpg",
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
    stack:[],
    selectCount: 0
};

const store = createStore((state = initialState, action) => {
    // TODO: Add action handlers (aka "reduces")
    switch (action.type) {
        case SET_INVENTORY:
            return {...state, inventory: action.items};
        case TOGGLE_ITEM:
            var selectCount = 0;
            var stack = [];
            var newState = {
                ...state, inventory: state.inventory.map(item=> {
                    if (item.sku === action.sku) {
                        item.selected = !item.selected;
                    }
                    if (item.selected){
                        selectCount++;
                        stack.push(item);
                    }
                    return item;
                }), stack: stack
            };

            return newState;

        case UPDATE_INVENTORY:
            return {
                ...state,
                stack: action.items.map(item=> {
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
