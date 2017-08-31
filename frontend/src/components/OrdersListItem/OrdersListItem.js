import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import './OrdersListItem.less';

export default class OrdersListItem extends Component {

   static propTypes = {
      data: PropTypes.object.isRequired,
      onClick: PropTypes.func
   };

   render() {
      return (
         <div className='OrdersListItem'
            onClick={() => this.props.onClick(this.props.data.id)}>
            <div className='OrdersListItem__date text--ellipsis'
               title={this.props.data.create_date.toLocaleString()}>{this.props.data.humanLifeStart}</div>
            <div className={`OrdersListItem__status text--ellipsis ${this.props.data.statusClass}`}
               title={this.props.data.humanStatus}>{this.props.data.humanStatus}</div>
            <div className='OrdersListItem__title text--ellipsis'
               title={this.props.data.title}>{this.props.data.title}</div>
            <div className='OrdersListItem__descr text--ellipsis'
               title={this.props.data.descr}>{this.props.data.descr}</div>
            <div className='OrdersListItem__price text--ellipsis'
               title={this.props.data.price + '₽'}>{this.props.data.price + '₽'}</div>
         </div>
      );
   }
}