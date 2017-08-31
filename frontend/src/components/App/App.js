import React from 'react';
import {
   Component
} from 'react';
import {
   Link,
   Route,
   Redirect
} from 'react-router-dom';
import {
   connect
} from 'react-redux';
import PropTypes from 'prop-types';
import Signup from '../Signup/Signup';
import Signin from '../Signin/Signin';
import OrdersTab from '../OrdersTab/OrdersTab';
import HeadArea from '../HeadArea/HeadArea';
import Balans from '../Balans/Balans';
import ModalsManager from '../ModalsManager/ModalsManager';
import './App.less';

class App extends Component {

   static propTypes = {
      hasTrobber: PropTypes.bool,
      isAuth: PropTypes.bool.isRequired
   }

   render() {
      return (
         <div className={'App' + (this.props.hasTrobber ? ' App--blur' : '')}>
            <div className='App__head'>
               <div className='App__title'>
                  <Link to='orders'>Биржа заказов</Link>
               </div>
               <HeadArea
                  className='App__head-widget'
                  isAuth={true} />
            </div>
            <div className='App__body'>
               <Route path='/signin' component={Signin} />
               <Route path='/signup' component={Signup} />
               <Route path='/orders' component={OrdersTab} />
               <Route path='/balans' component={Balans} />
            </div>
            {
               this.props.hasTrobber ? (
                  <div className='App__trobber'></div>
               ) : ''
            }
            {!this.props.isAuth ? (<Redirect to='signin' />) : (<Redirect to='orders' />)}
            <ModalsManager />
         </div>
      );
   }
}

const mapStateToProps = (state, selfPops) => {
   return {
      hasTrobber: state.general.hasTrobber,
      isAuth: state.general.isAuth
   };
};

export default App = connect(mapStateToProps)(App);