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
import SideBar from '../SideBar/SideBar';
import DateTransformer from '../../utils/DateTransformer';
import * as actions from '../../actionsStore';
import './OrdersTab.less';

class OrdersTab extends Component {

   static propTypes = {
      orders: PropTypes.array.isRequired,
      isAuth: PropTypes.bool.isRequired,
      filter: PropTypes.string.isRequired,
      currentUserId: PropTypes.string.isRequired,
      currentPage: PropTypes.number.isRequired,
      hasNext: PropTypes.bool.isRequired,
      heedLoad: PropTypes.bool.isRequired
   };

   _getBaseFilter(currFilter) {
      let filter = {
         page: 0
      };
      if(currFilter === 'onMe') {
         filter.executor_id = this.props.currentUserId;
      }
      if(currFilter === 'fromMe') {
         filter.customer_id = this.props.currentUserId;
      }
      return filter;
   }

   componentWillMount() {
      if(this.props.isAuth && true) {
         let filter = this._getBaseFilter(this.props.filter);
         filter.page = 0;
         this.props.getOrdersList(filter);
      }
   }

   componentWillUpdate(props) {
      if(props.heedLoad) {
         let filter = this._getBaseFilter(props.filter);
         filter.page = 0;
         this.props.getOrdersList(filter);
      }
   }

   loadPage() {
      let filter = this._getBaseFilter();
      filter.page = this.props.currentPage + 1;
      this.props.getOrdersList(filter);
   }

   render() {
      return (
         <div className='OrdersTab App--fullsize-content'>
            <SideBar />
            <OrdersList
               className='OrdersTab__orderes-list'
               onClick={this.props.openOrder}
               ordersList={this.props.orders}
               hasNext={this.props.hasNext}
               loadPage={::this.loadPage} />
            {!this.props.isAuth ? (<Redirect to='signin' />) : ''}
         </div>
      );
   }
}

const mapStateToProps = (state, ownProps) => {
   return {
      orders: state.order.showList.map(id => {
         let raw = state.order.store[id];
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
         raw.humanLifeStart = DateTransformer(raw.create_date);
         return raw;
      }),
      // .sort((a, b) => {
      //    return a.create_date.getTime() < b.create_date.getTime();
      // }),
      isAuth: state.general.isAuth,
      currentUserId: state.general.author_id || '-1',
      filter: state.order.filter,
      currentPage: state.order.page,
      hasNext: state.order.hasNext,
      heedLoad: state.order.heedLoad
   };
};

export default OrdersTab = connect(mapStateToProps, actions)(OrdersTab);