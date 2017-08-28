import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import './TextField.less';

export default class TextField extends Component {
   
   static propTypes = {
      text: PropTypes.string,
      onApply: PropTypes.func,
      onChange: PropTypes.func,
      onBlur: PropTypes.func,
      onChangeDelay: PropTypes.number,
      isPassword: PropTypes.bool,
      hasAutofocus: PropTypes.bool,
      maxLength: PropTypes.number,
      onlyNumbers: PropTypes.bool,
      clearOnApply: PropTypes.bool,
      placeholder: PropTypes.string
   };

   state = {
      text: this.props.text || ''
   };

   _$timer = null;

   handleSubmit = e => {
      const text = e.target.value.trim();
      if(e.which === 13 && text.length) {
         this.clearTimer();
         this.props.onApply && this.props.onApply(text);
         if (this.props.clearOnApply) {
            this.setState({
               text: ''
            });
         }
      }
   };

   clearTimer = _ => {
      this._$timer &&
         clearTimeout(this._$timer);
   };

   handleChange = e => {
      const newText = e.target.value;
      if(this.props.onlyNumbers) {
         if(!/^[0-9]*$/.test(newText)) {
            return;
         }
      }
      if(this.props.maxLength) {
         if(newText.length > this.props.maxLength) {
            return;
         }
      }
      this.setState({
         text: newText
      });
      if(this.props.onChangeDelay && this.props.onChange) {
         this.clearTimer();
         this._$timer = setTimeout(function() {
            this.props.onChange(newText);
            this._$timer = null;
         }.bind(this), this.props.onChangeDelay);
      } else if(this.props.onChange) {
         this.props.onChange(newText);
      }
   };

   handleBlur = e => {
      this.props.onBlur && this.props.onBlur(arguments);
   };

   render() {
      const additionalClass = this.state.text.length ? ' TextField__input--editing' : '';
      return (
         <div className={`TextField${this.props.className ? ' ' + this.props.className : ''}`}>
            <input
               className={`TextField__input${additionalClass}`}
               type={this.props.isPassword ? 'password' : 'text'}
               autoFocus={!!this.props.hasAutofocus}
               placeholder={this.props.placeholder}
               value={this.state.text}
               onBlur={this.handleBlur}
               onChange={this.handleChange}
               onKeyDown={this.handleSubmit} />
         </div>
      );
   }
}