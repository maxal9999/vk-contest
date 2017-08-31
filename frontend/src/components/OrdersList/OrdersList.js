import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import ListView from '../ListView/ListView';
import Button from '../Button/Button';
import OrdersListItem from '../OrdersListItem/OrdersListItem';
import './OrdersList.less';

export default class OrdersList extends Component {

   static propTypes = {
      ordersList: PropTypes.array,
      onClick: PropTypes.func,
      hasNext: PropTypes.bool,
      loadPage: PropTypes.func
   };

   render() {
      return (
         <div className={`OrdersList${this.props.className ? ' ' + this.props.className : ''}`}>
            <ListView
               template={OrdersListItem}
               list={this.props.ordersList}
               emptyData='Нет ни одного заказа'
               onClick={this.props.onClick} />
            {this.props.hasNext ? (
               <Button
                  className='OrdersList__paging-button'
                  caption='Загрузить еще'
                  onClick={::this.props.loadPage} />
            ) : ''}
         </div>
      );
   }
}