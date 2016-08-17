/**
 * Created by fst on 8/17/16.
 */

import React from 'react';
import store from '../../core/store';

class Provider extends React.Component {

    constructor(props){
        super(props);
    }

    componentWillMount(){
        store.subscribe(this.render);
    }


};

export default Provider;