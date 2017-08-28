import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import {
   Link
} from 'react-router-dom';
import Button from '../Button/Button';
import ListView from '../ListView/ListView';
import OrdersListItem from '../OrdersListItem/OrdersListItem';
import './OrdersList.less';

export default class OrdersList extends Component {

   static propTypes = {
      ordersList: PropTypes.array
   };

   openOrder() {

   }

   render() {
      return (
         <div className='OrdersList'>
            <ListView
               template={OrdersListItem}
               list={this.props.ordersList}
               emptyData='Нет ни одного заказа'
               onClick={::this.openOrder} />
         </div>
      );
   }
}