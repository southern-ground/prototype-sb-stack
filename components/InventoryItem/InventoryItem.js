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

    componentWillMount(){
        this.state = this.props.state;
    }

    tileClicked(e){
        // console.log(this.refs('checkBox'));
        e.stopPropagation();
        store.dispatch({type: TOGGLE_ITEM, sku: this.state.sku});
    }

    toggleSelected(e) {
        store.dispatch({type: TOGGLE_ITEM, sku: e.target.value});
    }

    render() {

        return (
            <div className={styles.inventoryItem} onClick={this.tileClicked}>
                <div className={styles.inventoryItemDetails}>
                    <img className={styles.inventoryImage} src={"img/product/" + this.state.image} />
                    <div className={styles.details}>
                        <input type="checkBox"
                               id={this.state.sku}
                               onChange={this.toggleSelected}
                               value={this.state.sku}
                               checked={this.state.selected}
                               ref="checkBox"
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
