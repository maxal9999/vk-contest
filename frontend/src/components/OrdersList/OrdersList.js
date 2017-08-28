import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import ListView from '../ListView/ListView';
import OrdersListItem from '../OrdersListItem/OrdersListItem';
import './OrdersList.less';

export default class OrdersList extends Component {

   static propTypes = {
      ordersList: PropTypes.array,
      onClick: PropTypes.func
   };

   render() {
      return (
         <div className='OrdersList'>
            <ListView
               template={OrdersListItem}
               list={this.props.ordersList}
               emptyData='Нет ни одного заказа'
               onClick={this.props.onClick} />
         </div>
      );
   }
}