import React from 'react';
import {
   Component
} from 'react';
import {
   Link,
   Route
} from 'react-router-dom';
import PropTypes from 'prop-types';
import Signup from '../Signup/Signup';
import Signin from '../Signin/Signin';
import './App.less';

class App extends Component {

   static propTypes = {
      activeTab: PropTypes.string
   }

   render() {
      return (
         <div className={'App App--' + this.props.activeTab}>
            <div className='App__head'>
               <div className='App__title'>Биржа заказов</div>
               <div className='App__links'>
                  <Link className='App__link-signup'
                     to='signup'>Зарегистрироваться</Link>
                  <Link className='App__link-signin'
                     to='signin'>Войти</Link>
                  <Link className='App__link-logout'
                     to='logout'>Выход</Link>
               </div>
            </div>
            <div className='App__body'>
               <Route path="/signup" component={Signup} />
               <Route path="/signin" component={Signin} />
            </div>
         </div>
      );
   }
}

export default App;