import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import {
   connect
} from 'react-redux';
import OrdersList from '../OrdersList/OrdersList';
import Button from '../Button/Button';
import * as actions from '../../actionsStore';
import './SideBar.less';

class SideBar extends Component {

   static propTypes = {
      activeFilter: PropTypes.string.isRequired
   };

   createOrder() {
      this.props.openOrder();
   }

   filterProxy(targetFilter) {
      if(targetFilter !== this.props.activeFilter) {
         this.props.activateFilter(targetFilter);
      }
   }

   render() {
      return (
         <div className='SideBar'>
            <Button
               className='SideBar__item'
               caption='Создать заказ'
               onClick={::this.createOrder} />
            <Button
               className={'SideBar__item' + (this.props.activeFilter === 'all' ? ' SideBar__item--active' : '')}
               caption='Доступные заказы'
               onClick={this.filterProxy.bind(this, 'all')} />
            <Button
               className={'SideBar__item' + (this.props.activeFilter === 'onMe' ? ' SideBar__item--active' : '')}
               caption='Заказы на мне'
               onClick={this.filterProxy.bind(this, 'onMe')} />
            <Button
               className={'SideBar__item' + (this.props.activeFilter === 'fromMe' ? ' SideBar__item--active' : '')}
               caption='Заказы мои'
               onClick={this.filterProxy.bind(this, 'fromMe')} />
         </div>
      );
   }
}

const mapStateToProps = (state, ownProps) => {
   return {
      activeFilter: state.order.filter
   };
};

export default SideBar = connect(mapStateToProps, actions)(SideBar);