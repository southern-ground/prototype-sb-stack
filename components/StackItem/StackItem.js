/**
 * Created by fst on 8/16/16.
 */

import React from 'react';
import styles from './styles.css';

class StackItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.props.state;
    }

    render() {
console.log(this.state);
        return (
            <div className={styles.stackItem + " stack-item"} data-sku={this.state.sku}>
                <img className={styles.stackItemImage} src={ "img/product/" + this.state.image } />
            </div>
        );
    }

}

export default StackItem;
