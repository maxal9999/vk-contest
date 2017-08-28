import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import {
   Link
} from 'react-router-dom';
import './BalansWidget.less';

export default class BalansWidget extends Component {

   static propTypes = {
      balans: PropTypes.number.isRequired
   };

   render() {
      return (
         <div className={'BalansWidget ' + (this.props.className ? this.props.className : '')}
            title={this.props.balans + '₽'}>
            <Link className='BalansWidget__sum'
               to='balans'>{this.props.balans + '₽'}</Link>
         </div>
      );
   }
}