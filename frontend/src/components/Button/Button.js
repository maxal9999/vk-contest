import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import {
   Link
} from 'react-router-dom';
import TextField from '../TextField/TextField';
import './Button.less';

export default class Button extends Component {

   static propTypes = {
      caption: PropTypes.string.isRequired,
      isPrimary: PropTypes.bool,
      onClick: PropTypes.func.isRequired
   };

   compileClass() {
      let result = 'Button';
      this.props.className && (
         result += ' ' + this.props.className
      );
      this.props.isPrimary && (
         result += ' Button--primary'
      );
      return result;
   }

   render() {
      return (
         <button
            className={this.compileClass()}
            onClick={::this.props.onClick}
            title={this.props.caption}>{this.props.caption}</button>
      );
   }
}