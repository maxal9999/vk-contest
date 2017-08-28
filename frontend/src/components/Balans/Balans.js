import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import {
   Redirect
} from 'react-router-dom';
import {
   connect
} from 'react-redux';
import Button from '../Button/Button';
import * as actions from '../../actionsStore';
import TextField from '../TextField/TextField';
import './Balans.less';

class Balans extends Component {

   static propTypes = {
      sum: PropTypes.number,
      isAuth: PropTypes.bool
   };

   state = {
      donateVisible: false,
      donateSum: 0
   };

   onDonateButton() {
      this.setState({
         donateVisible: true
      });
   }

   onCancelDonate() {
      this.setState({
         donateVisible: false,
         donateSum: 0.0
      });
   }

   onSubmitDonate() {
      if(this.state.donateSum) {
         this.props.changeBalans({
            delta: this.state.donateSum
         });
         this.setState({
            donateVisible: false,
            donateSum: 0.0
         });
      } else {
         this.props.showAlert('Укажите сумму платежа!');
      }
   }

   onChange(value) {
      this.setState({
         donateSum: parseInt(value)
      });
   }

   render() {
      return (
         <div className='Balans'>
            <div className='Balans__sum-area'>
               <div className='Balans__caption'
                  title='У вас на счету'>У вас на счету</div>
               <div className='Balans__sum'
                  title={this.props.sum + '₽'}>{this.props.sum + '₽'}</div>
            </div>
            {this.state.donateVisible ? (
               <div className='Balans__donate-button'>
                  <TextField
                     onChange={::this.onChange}
                     onlyNumbers={true}
                     onApply={::this.onSubmitDonate}
                     maxLength={10}
                     hasAutofocus={true}
                     placeholder='Сумма пополнения' />
                  <Button
                     className='Balans__donate-button'
                     caption='Пополнить'
                     isPrimary={true}
                     onClick={::this.onSubmitDonate} />
                  <Button
                     className='Balans__cancel-donate'
                     caption='Отмена'
                     onClick={::this.onCancelDonate} />
               </div>
            ) : (
               <Button
                  className='Balans__donate-button'
                  caption='Пополнить счет'
                  isPrimary={true}
                  onClick={::this.onDonateButton} />
            )}
            {!this.props.isAuth ? (<Redirect to='signin' />) : ''}
         </div>
      );
   }
}

const mapStateToProps = (state, ownProps) => {
   return {
      sum: state.general.balans,
      isAuth: state.general.isAuth
   };
};

export default Balans = connect(mapStateToProps, actions)(Balans);