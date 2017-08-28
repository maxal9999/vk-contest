import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import './ListView.less';

export default class ListView extends Component {

   static propTypes = {
      template: PropTypes.func.isRequired,
      list: PropTypes.array,
      emptyData: PropTypes.string,
      onClick: PropTypes.func.isRequired
   };

   static defaultProps = {
      list: [],
      emptyData: 'Нет данных'
   };

   render() {
      return (
         <div className='ListView'>
            {this.props.list.length ?
               this.props.list.map(item =>
                  <div className='ListView__item' key={item.id}>
                     <this.props.template
                        id={item.id}
                        data={item}
                        onClick={this.props.onClick} />
                  </div>)
               :
               <div className='ListView__empty-data'
                  title={this.props.emptyData}>{this.props.emptyData}
               </div>
            }
         </div>
      );
   }
}