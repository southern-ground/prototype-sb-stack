/**
 * Created by fst on 8/16/16.
 */

import React from 'react';
import s from './styles.css';

class StackItem extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={s.stackItem + " stack-item"} data-sku={this.props.sku}>
                <img className={s.stackItemImage} src={ "img/product/" + this.props.image }/>
            </div>
        );
    }
}

export default StackItem;
