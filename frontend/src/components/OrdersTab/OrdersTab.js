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
               break;
            case 1:
               raw.humanStatus = 'В работе';
               break;
            case 2:
               raw.humanStatus = 'Завершен';
               break;
         }
         return raw;
      }),
      isAuth: state.general.isAuth
   };
};

export default OrdersTab = connect(mapStateToProps)(OrdersTab);