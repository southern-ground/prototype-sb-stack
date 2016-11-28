/**
 * Created by fst on 10/3/16.
 */
/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import _ from 'lodash';
import Layout from '../../components/Layout';
import s from './styles.css';
import {title, html} from './index.md';
import InventoryItem from '../../components/InventoryItem/InventoryItem';
import store from '../../core/store';
import history from '../../core/history';
import {GET_INVENTORY, CLEAR_ALL_ITEMS} from '../../core/action-types';

class ChoosePage extends React.Component {

    constructor(props) {

        super(props);

        this.updateProps = this.updateProps.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

        this.state = {
            inventory: store.getState().inventory,
            stack: store.getState().stack,
            selectCount: store.getState().stack.length,
            enableButton: store.getState().enoughSelected
        };

    }

    componentWillMount() {

        this.unsubscribeFunciton = store.subscribe(this.updateProps);

        document.title = title;

        if(this.state.inventory.length === 0){
            store.dispatch({
                type: GET_INVENTORY
            })
        }

    }

    componentDidMount() {

        var findPos = (obj)=>{
            var curtop = 0;
            if (obj.offsetParent) {
                do {
                    curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
                return [curtop];
            }
        };

        window.scroll(0,findPos(document.getElementById("container")));

        document.addEventListener('scroll',  _.debounce(this.handleScroll, 500));

    }

    componentWillUnmount(){
        this.unsubscribeFunciton();
        document.removeEventListener('scroll', _.debounce(this.handleScroll, 500));
    }

    handleScroll(){

        try{

            var el = document.getElementById('ScrolledStackControls'),
                container = document.getElementById('Stack'),
                viewportOffset = container.getBoundingClientRect();

            if(viewportOffset.top < -100 ){
                el.classList.remove(s.hidden);
            }else{
                el.classList.add(s.hidden);
            }
            
        }catch(e){
            // Nothing; it's a short-coming of the mount/dismount process
            // and the sortable JS library.
        }

    }

    updateProps() {
        var _state = store.getState();
        this.setState({
            inventory: _state.inventory,
            stack: _state.stack,
            selectCount: _state.stack.length,
            enableButton: _state.enoughSelected
        });
    }

    clearAllClick(){
        store.dispatch({type:CLEAR_ALL_ITEMS});
    }

    compareClick() {
        history.push({pathname: "/arrange"});
    }

    renderInventory(){
        return (
            <div>

                <div id="StackControls" className={s.stackControls}>

                    <button
                        disabled={!this.state.enableButton}
                        onClick={this.compareClick}
                        className={s.viewButton + " " + (this.state.enableButton ? "" : s.buttonDisabled)}>
                        View
                    </button>

                    <button
                        disabled={!this.state.enableButton}
                        onClick={this.clearAllClick}
                        className={s.viewButton + " " + (this.state.stack.length > 0 ? "" : s.buttonDisabled)}>
                        Clear All
                    </button>

                </div>

                <div id="ScrolledStackControls" className={s.stackControls + " " + s.scrolledStackControls + " " + s.hidden}>

                    <button
                        disabled={!this.state.enableButton}
                        onClick={this.compareClick}
                        className={s.viewButton + " " + (this.state.enableButton ? "" : s.buttonDisabled)}>
                        View
                    </button>

                    <button
                        disabled={!this.state.enableButton}
                        onClick={this.clearAllClick}
                        className={s.viewButton + " " + (this.state.stack.length > 0 ? "" : s.buttonDisabled)}>
                        Clear All
                    </button>

                </div>

                <div className={s.instructions}>
                    Choose at least two
                </div>

                <div className={s.inventoryContainer}>
                    {this.state.inventory.map((item, index)=> {
                        return <InventoryItem
                            sku={item.sku}
                            image={item.image}
                            selected={item.selected}
                            name={item.name}
                            price={item.price}
                            key={'inv-' + item.sku + '-' + index}
                        />
                    })}
                </div>

            </div>
        );
    }

    renderLoading(){
        return (
            <div className={s.inventoryContainer + " " + s.loading}>
                <h3>Please Wait</h3>
                <img className={s.inventoryLoadingAnimation} src="/img/loading.gif" />
                <p>We're fetching all available products.</p>
            </div>
        );
    }

    render() {

        return (

            <Layout id="Stack">

                <div className={s.sectionTop}>

                    <h2 className={s.title}>Build Your Stack</h2>

                </div>

                <div className={s.sectionBottom}>

                    { this.state.inventory.length > 0 ? this.renderInventory() : this.renderLoading() }

                </div>

            </Layout>
        );
    }

}

export default ChoosePage;
