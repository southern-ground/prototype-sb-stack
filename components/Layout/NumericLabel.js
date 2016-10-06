import React, { Component } from 'react';

const NumericLabel = (props) => {

    // inspired by http://stackoverflow.com/a/9462382
    function nFormatter(num, minValue) {

        if(!num || !+num || typeof +num !== 'number'  ){
            return {
                number: num
            }
        }

        var num = +num;

        var minValue = minValue || 0;
        var si = [
            { value: 1E18, symbol: "E" },
            { value: 1E15, symbol: "P" },
            { value: 1E12, symbol: "T" },
            { value: 1E9,  symbol: "G" },
            { value: 1E6,  symbol: "M" },
            { value: 1E3,  symbol: "k" }
        ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;

        if(typeof num === 'number' && num >= minValue) {
            for (i = 0; i < si.length; i++) {
                if (num >= si[i].value) {
                    //return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
                    return {
                        number: num / si[i].value,
                        letter: si[i].symbol
                    }
                }
            }
        }
        //return num.replace(rx, "$1");
        return {
            number: num
        }
    }


    if(props.params) {
        var locales = props.params.locales;
        if(props.params.wholenumber == 'floor'){
            var number = Math.floor(props.children);
        }else if(props.params.wholenumber == 'ceil'){
            var number = Math.ceil(props.children);
        }else{
            var number = props.children;
        }

        var styles = 'right';
        if(props.params.justification == 'L') {
            styles = 'left';
        }
        else if(props.params.justification == 'C') {
            styles = 'center';
        }
        else{
            styles = 'right';
        }
        var mystyle = {
            'textAlign':styles
        };

        if(props.params.currencyIndicator) {
            var currencyIndicator = props.params.currencyIndicator
        }
        else {
            var currencyIndicator = 'USD';
        }

        if(props.params.percentage){
            var option = {
                style:'percent',
                maximumFractionDigits:props.params.precision,
                useGrouping:props.params.commafy
            };
        }
        else if(props.params.currency){
            var option = {
                style:'currency',
                currency:currencyIndicator,
                maximumFractionDigits:props.params.precision,
                useGrouping:props.params.commafy
            };
        }
        else {
            var option = {
                style:'decimal',
                maximumFractionDigits:props.params.precision,
                useGrouping:props.params.commafy
            };
        }

        var css = '';
        if(props.params.cssClass) {
            props.params.cssClass.map((clas) => {
                css += clas + ' ';
            });
        }

    }
    else{
        var number = props.children;
        var locales = 'en-US';
        var mystyle = {
            'textAlign':'left'
        };
        var option = {};
    }

    var shortenNumber = number;
    var numberLetter = '';

    if(props.params && props.params.shortFormat) {
        var sn = nFormatter(number, props.params.shortFormatMinValue||0 );
        shortenNumber = sn.number;
        numberLetter = sn.letter || '';

        if( props.params.shortFormatMinValue && +number >=  props.params.shortFormatMinValue ){
            option.maximumFractionDigits = props.params.shortFormatPrecision || props.params.precision || 0
        }
    }

    var theFormattedNumber = shortenNumber;

    if(typeof shortenNumber === 'number'){
        theFormattedNumber = Intl.NumberFormat(locales,option).format(+shortenNumber);
    }

    if(numberLetter){
        if( props.params && props.params.percentage ) {
            theFormattedNumber = theFormattedNumber.replace('%', numberLetter + '%');
        } else {
            theFormattedNumber += numberLetter;
        }
    }

    var title = false;
    if(props.params && props.params.title ){
        props.params.title === true ? title = number : title = props.params.title;
    }

    if( mystyle.textAlign && ( mystyle.textAlign == 'right' || mystyle.textAlign == 'center' )  ){
        // div
        if(title){
            // with title
            return(
                <div className={css} style={mystyle} title={title} >
                    { theFormattedNumber }
                </div>
            )
        } else {
            // without title
            return(
                <div className={css} style={mystyle} >
                    { theFormattedNumber }
                </div>
            )
        }
    } else {
        // span
        if(title){
            // with title
            return(
                <span className={css} style={mystyle} title={title} >
            { theFormattedNumber }
          </span>
            )
        } else {
            // without title
            return(
                <span className={css} style={mystyle} >
            { theFormattedNumber }
          </span>
            )
        }
    }

}

export default NumericLabel;