import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import {
   Link
} from 'react-router-dom';
import {
   connect
} from 'react-redux';
import Button from '../Button/Button';
import BalansWidget from '../BalansWidget/BalansWidget';
import * as actions from '../../actionsStore';
import './HeadArea.less';

class HeadArea extends Component {

   static propTypes = {
      isAuth: PropTypes.bool.isRequired,
      nickname: PropTypes.string,
      balans: PropTypes.number
   };

   render() {
      return (
         <div className={'HeadArea ' + (this.props.className ? this.props.className : '')}>
            {this.props.isAuth ? (
               <div className='HeadArea__wrapper'>
                  <BalansWidget
                     balans={this.props.balans} />
                  <Link className='HeadArea__user-name'
                     title={this.props.nickname}
                     to='orders'>{this.props.nickname}</Link>
                  <Button
                     className='HeadArea__link-logout'
                     onClick={this.props.logOut}
                     caption='Выйти' />
               </div>
            ) : (
               <div className='HeadArea__wrapper'></div>
            )}
         </div>
      );
   }
}

const mapStateToProps = (state, ownProps) => {
   return {
      isAuth: state.general.isAuth || false,
      nickname: state.general.nickname,
      balans: state.general.balans
   };
};

export default HeadArea = connect(mapStateToProps, actions)(HeadArea);