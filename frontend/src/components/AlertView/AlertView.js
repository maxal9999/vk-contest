import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import './AlertView.less';

export default class AlertView extends Component {

   static propTypes = {
      data: PropTypes.object.isRequired
   };

   render() {
      return (
         <div className='AlertView'>
            <span className='AlertView_text'
               title={this.props.data.text}>{this.props.data.text}
            </span>
         </div>
      );
   }
}