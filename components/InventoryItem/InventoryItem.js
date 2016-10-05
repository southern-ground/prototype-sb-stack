/**
 * Created by fst on 8/16/16.
 */

import React from 'react';
import styles from './styles.css';
import store from '../../core/store';
import {TOGGLE_ITEM} from '../../core/action-types';

class InventoryItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.props.state;
        this.toggleSelected = this.toggleSelected.bind(this);
    }

    rgbToHex(r, g, b) {
        var componentToHex = function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    toggleSelected(e) {

        store.dispatch({type: TOGGLE_ITEM, sku: e.target.value});

    }

    render() {

        return (
            <div className={styles.inventoryItem}>
                <div className={styles.inventoryItemDetails}>
                    <img className={styles.inventoryImage} src={"img/product/" + this.state.image} />
                    <div className={styles.details}>

                        <input type="checkBox"
                               id={this.state.sku}
                               onChange={this.toggleSelected}
                               value={this.state.sku}
                               checked={this.state.selected}
                        />

                        <label htmlFor={this.state.sku}></label>

                        <p className={this.state.selected ? "" : styles.deselected}>
                            {this.state.name}
                        </p>
                    </div>
                    <hr className={styles.separator} />
                </div>
            </div>
        );
    }

}

export default InventoryItem;
