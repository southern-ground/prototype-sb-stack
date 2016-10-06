/**
 * Created by fst on 10/6/16.
 */

import React from 'react';
import s from './DetailsItem.css';
import NumericLabel from './NumericLabel';
import {REMOVE_ITEM} from '../../core/action-types';
import store from '../../core/store';

class DetailsItem extends React.Component {

    constructor(props) {
        super(props);
        this.renderPrice = this.renderPrice.bind(this);
    }

    removeInventoryItem(e) {

        e.preventDefault();

        store.dispatch({
            type: REMOVE_ITEM,
            sku: e.target.getAttribute('data-sku')
        });

    }

    renderPrice() {

        var currencyParams = {
            justification: 'L',
            currency: true,
            currencyIndicator: 'USD',
            percentage: false,
            precision: 2,
            commafy: true
        };

        if (this.props.isHR) {
            return <span>{this.props.price}</span>
        } else if (this.props.isTotal) {
            return (
                <span className={s.invoiceTotal}>
                    <NumericLabel
                        params={currencyParams}>
                        {this.props.price}
                        </NumericLabel>
                </span>
            );
        } else {

            return (<
                    NumericLabel
                    params={currencyParams}>
                    {this.props.price}
                </NumericLabel>
            );
        }

    }

    renderRemove() {
        if (this.props.isHR || this.props.isTotal) {
            return null;
        }
        return (
            <a href="#"
               className={s.detailRemoveLink}
               data-sku={this.props.sku}
               onClick={this.removeInventoryItem}
            >Remove</a>
        );
    }

    render() {

        return (
            <div className={s.detailRow + (this.props.isHR ? " " + s.detailRowHR : "")}>
                <div className={this.props.isHR ? s.detailHR : s.detailName}>
                    {this.props.name}
                </div>
                <div className={s.centered + " " + (this.props.isHR ? s.detailHR : s.detailSku)}>
                    {this.props.sku}
                </div>
                <div className={s.centered + " " + (this.props.isHR ? s.detailHR : s.detailQty)}>
                    {this.props.quanity}
                </div>
                <div className={this.props.isHR ? s.detailHR : s.detailPrice}>
                    {this.renderPrice()}
                </div>
                <div className={s.detailRemove}>
                    {this.renderRemove()}
                </div>
            </div>
        );
    }

}

export default DetailsItem;
