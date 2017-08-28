import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import {
   Link,
   Redirect
} from 'react-router-dom';
import {
   connect
} from 'react-redux';
import OrdersList from '../OrdersList/OrdersList';
import DateTransformer from '../../utils/DateTransformer';
import * as actions from '../../actionsStore';
import './OrdersTab.less';

class OrdersTab extends Component {

   static propTypes = {
      orders: PropTypes.array.isRequired,
      isAuth: PropTypes.bool.isRequired,
   };

   render() {
      return (
         <div className='OrdersTab'>
            <OrdersList
               onClick={this.props.openOrder}
               ordersList={this.props.orders} />
             {!this.props.isAuth ? (<Redirect to='signin' />) : ''}
         </div>
      );
   }
}

const mapStateToProps = (state, ownProps) => {
   return {
      orders: Object.keys(state.order.store).map(num => state.order.store[num]).map(_raw => {
         let raw = _raw;
         switch(raw.status) {
            case 0:
               raw.humanStatus = 'В ожидании';
               raw.statusClass = 'OrdersListItem--waiting';
               break;
            case 1:
               raw.humanStatus = 'В работе';
               raw.statusClass = 'OrdersListItem--in-work';
               break;
            case 2:
               raw.humanStatus = 'Завершен';
               raw.statusClass = 'OrdersListItem--done';
               break;
         }
         raw.humanLifeStart = DateTransformer(raw.lifeStart);
         return raw;
      }),
      isAuth: state.general.isAuth
   };
};

export default OrdersTab = connect(mapStateToProps, actions)(OrdersTab);