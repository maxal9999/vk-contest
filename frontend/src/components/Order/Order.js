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
      id: PropTypes.string,
      isEditState: PropTypes.bool,
      title: PropTypes.string,
      description: PropTypes.string,
      comment: PropTypes.string,
      price: PropTypes.string,
      status: PropTypes.number,
      humanLifeEnd: PropTypes.string,
      currentExecutor: PropTypes.bool,
      currentAuthor: PropTypes.bool
   };

   state = {
      title: '',
      description: '',
      price: '',
      comment: ''
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
            price: this.state.price
         });
         this.props.close();
      } else {
         this.props.showAlert('Некорректно заполнена форма заказа!');
      }
   }

   onDoneOrder() {
      this.props.doneOrder({
         id: this.props.id,
         comment: this.state.comment || ''
      });
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
                  placeholder='Заголовок заказа' />
               <TextField
                  className='Order__price Order__price--edit'
                  onChange={this.onChange.bind(this, 'price')}
                  onlyNumbers={true}
                  maxLength={8}
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
            </div>
         ) : (
            <div className='Order__body'>
               <div className='Order__description'
                  title={this.props.description}>{this.props.description}</div>
               {this.props.currentExecutor && this.props.status === 1 ? (
                  <TextField
                     className='Order__comment'
                     onChange={this.onChange.bind(this, 'comment')}
                     placeholder='Комментарий' />
               ) : ''}
               {this.props.comment ? (
                  <div className='Order__comment'
                     title={this.props.comment}>
                        <div className='Order__comment-caption'
                           title='Комментарий исполнителя:'>Комментарий исполнителя:</div>
                        <div className='Order__comment-value'
                           title={this.props.comment}>{this.props.comment}</div>
                  </div>
               ) : ''}
            </div>
         )
      );
   }

   renderButtons() {
      let res;
      if(this.props.isEditState) {
         res = (
            <Button
               className='Order__send-button'
               caption='Разместить'
               isPrimary={true}
               onClick={::this.onSendOrder} />
         );
      } else {
         if (
            this.props.status === 0 &&
            !this.props.currentExecutor &&
            !this.props.currentAuthor
         ) {
            res = (
               <Button
                  className='Order__get-button'
                  caption='Взять в работу'
                  isPrimary={true}
                  onClick={this.props.getOrderInWork.bind(this, this.props.id)} />
            );
         } else if(this.props.status === 1 && this.props.currentExecutor) {
            res = (
               <Button
                  className='Order__done-button Order--in-work'
                  caption='Завершить выполнение'
                  isPrimary={true}
                  onClick={::this.onDoneOrder} />
            );
         } else if(this.props.status === 2) {
            res = (
               <div className='Order__done-area Order--done'>
                  <div className='Order__done-caption'
                     title='Заказ исполнен'>Заказ исполнен</div>
                  <div className='Order__done-caption'
                     title={this.props.end_date.toLocaleString()}>{this.props.humanLifeEnd}</div>
               </div>
            );
         }
      }
      return (
         <div className='Order__bottom-area'>{res}</div>
      );
   }

   render() {
      return (
         <div className='Order'>
            { this.renderHead() }
            { this.renderBody() }
            { this.renderButtons() }
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
      let currOrder = state.order.store[ownProps.id];
      data.isEditState = false;
      data.title = currOrder.title;
      data.description = currOrder.descr;
      data.price = currOrder.price;
      data.status = currOrder.status;
      data.currentExecutor = currOrder.executor_id === state.general.author_id;
      data.currentAuthor = currOrder.customer_id === state.general.author_id;
      data.comment = currOrder.comment_txt || '';
      if(currOrder.end_date) {
         data.end_date = currOrder.end_date;
         data.humanLifeEnd = DateTransformer(data.end_date);
      }
   }
   return data;
};

export default Order = connect(mapStateToProps, actions)(Order);