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

    rgbToHex(r, g, b) {
        var componentToHex = function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    render() {

        var rgbValue = this.rgbToHex(this.state.background.red,
            this.state.background.green,
            this.state.background.blue),
            style = {
                "backgroundColor": rgbValue
            };

        return (
            <div className={styles.stackItem + " stack-item"} style={style} data-sku={this.state.sku}>
                {this.state.name}
            </div>
        );
    }

}

export default StackItem;
