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
        this.toggleSelected = this.toggleSelected.bind(this);
        this.tileClicked = this.tileClicked.bind(this);
    }

    tileClicked(e){
        e.stopPropagation();
        store.dispatch({type: TOGGLE_ITEM, sku: this.props.sku});
    }

    toggleSelected(e) {
        store.dispatch({type: TOGGLE_ITEM, sku: e.target.value});
    }

    render() {

        return (
            <div className={styles.inventoryItem} onClick={this.tileClicked}>
                <div className={styles.inventoryItemDetails}>
                    <img className={styles.inventoryImage} src={"/img/product/" + this.props.image} />
                    <div className={styles.details}>
                        <input type="checkBox"
                               id={this.props.sku}
                               onChange={this.toggleSelected}
                               value={this.props.sku}
                               checked={this.props.selected}
                               ref="checkBox"
                        />
                        <label htmlFor={this.props.sku}></label>
                        <p className={this.props.selected ? "" : styles.deselected}>
                            {this.props.name}
                        </p>
                    </div>
                    <hr className={styles.separator} />
                </div>
            </div>
        );
    }

}

export default InventoryItem;
