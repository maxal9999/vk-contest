import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import {
   connect
} from 'react-redux';
import * as actions from '../../actionsStore';
import DateTransformer from '../../utils/DateTransformer';
import TextField from '../TextField/TextField';
import Button from '../Button/Button';
import './Order.less';

class Order extends Component {

   static propTypes = {
      id: PropTypes.number,
      isEditState: PropTypes.bool,
      title: PropTypes.string,
      description: PropTypes.string,
      price: PropTypes.number,
      status: PropTypes.number,
      humanLifeEnd: PropTypes.string
   };

   state = {
      title: '',
      description: '',
      price: ''
   };

   onSendOrder() {
      if (
         this.state.title &&
         this.state.description &&
         this.state.price
      ) {
         this.props.addOrder({
            title: this.state.title,
            descr: this.state.description,
            price: +this.state.price
         });
         this.props.close();
      } else {
         this.props.showAlert('Некорректно заполнена форма заказа!');
      }
   }

   onGetOrder() {
      this.props.getOrderInWork.bind(this, this.props.id);
   }

   onDoneOrder() {
      this.props.doneOrder.bind(this, this.props.id);
   }

   onChange(field, value) {
      let state = {};
      state[field] = value;
      this.setState(state);
   }

   renderHead() {
      return (
         this.props.isEditState ? (
            <div className='Order__head'>
               <TextField
                  className='Order__title Order__title--edit'
                  hasAutofocus={true}
                  onChange={this.onChange.bind(this, 'title')}
                  placeholder='Загловок заказа' />
               <TextField
                  className='Order__price Order__price--edit'
                  onChange={this.onChange.bind(this, 'price')}
                  onlyNumbers={true}
                  maxLength={5}
                  placeholder='Цена заказа' />
            </div>
         ) : (
            <div className='Order__head'>
               <div className='Order__title'
                  title={this.props.title}>{this.props.title}</div>
               <div className='Order__price'
                  title={this.props.price + '₽'}>{this.props.price + '₽'}</div>
            </div>
         )
      );
   }

   renderBody() {
      return (
         this.props.isEditState ? (
            <div className='Order__body'>
               <TextField
                  className='Order__description Order__description--edit'
                  onChange={this.onChange.bind(this, 'description')}
                  placeholder='Описание заказа' />
               <Button
                  className='Order__send-button'
                  caption='Разместить'
                  isPrimary={true}
                  onClick={::this.onSendOrder} />
            </div>
         ) : (
            <div className='Order__body'>
               <div className='Order__description'
                  title={this.props.description}>{this.props.description}</div>
               {this.props.status === 0 ? (
                  <Button
                     className='Order__get-button'
                     caption='Взять в работу'
                     isPrimary={true}
                     onClick={this.props.getOrderInWork.bind(this, this.props.id)} />
               ) : (
                  this.props.status === 1 ? (
                     <Button
                        className='Order__done-button'
                        caption='Завершить выполнение'
                        isPrimary={true}
                        onClick={this.props.doneOrder.bind(this, this.props.id)} />
                  ) : (
                     <div className='Order__done-area'>
                        <div className='Order__done-caption'
                           title='Заказ исполнен'>Заказ исполнен</div>
                        <div className='Order__done-caption'
                           title={this.props.lifeEnd.toLocaleString()}>{this.props.humanLifeEnd}</div>
                     </div>
                  )
               )}
            </div>
         )
      );
   }

   render() {
      return (
         <div className='Order'>
            { this.renderHead() }
            { this.renderBody() }
         </div>
      );
   }
}

const mapStateToProps = (state, ownProps) => {
   let data = {
      isEditState: true,
      title: '',
      description: '',
      price: ''
   };
   if(ownProps.id) {
      data.isEditState = false;
      data.title = state.order.store[ownProps.id].title;
      data.description = state.order.store[ownProps.id].descr;
      data.price = state.order.store[ownProps.id].price;
      data.status = state.order.store[ownProps.id].status;
      if(state.order.store[ownProps.id].lifeEnd) {
         data.lifeEnd = state.order.store[ownProps.id].lifeEnd;
         data.humanLifeEnd = DateTransformer(data.lifeEnd);
      }
   }
   return data;
};

export default Order = connect(mapStateToProps, actions)(Order);