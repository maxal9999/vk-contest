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
import TextField from '../TextField/TextField';
import * as actions from '../../actionsStore';
import Button from '../Button/Button';
import './Signin.less';

class Signin extends Component {

   static propTypes = {
      isAuth: PropTypes.bool
   };

   state = {
      login: '',
      password: ''
   };

   componentWillMount() {
      if(this.props.isAuth) {
         this.props.logOut();
      }
   }

   handleSignin() {
      const login = this.state.login,
         pass = this.state.password;
      let errMessage;
      if(!login && !pass) {
         errMessage = 'Укажите имя пользователя и пароль!';
      } else if(!login) {
         errMessage = 'Укажите имя пользователя!';
      } else if(!pass) {
         errMessage = 'Укажите пароль!';
      }
      if(errMessage) {
         return this.props.showAlert(errMessage);
      }
      this.props.signIn({
         login: login,
         password: pass
      });
   }

   onChange(field, value) {
      let state = {};
      state[field] = value;
      this.setState(state);
   }

   render() {
      return (
         <div className='Signin'>
            <div className='Signin__head'>Вход в аккаунт</div>
            <div className='Signin__body'>
               <div className='Signin__form'>
                  <TextField
                     placeholder='Имя пользователя'
                     onChange={this.onChange.bind(this, 'login')}
                     hasAutofocus={true} />
                  <TextField
                     placeholder='Пароль'
                     onChange={this.onChange.bind(this, 'password')}
                     isPassword={true} />
                  <Button
                     caption='Войти'
                     isPrimary={true}
                     className='Signin__button'
                     onClick={::this.handleSignin} />
               </div>
               <Link className='Signin__switch'
                  to='signup'>У вас еще нет аккаунта?</Link>
            </div>
            {this.props.isAuth ? (<Redirect to='orders' />) : ''}
         </div>
      );
   }
}

const mapStateToProps = (state, ownProps) => {
   return {
      isAuth: state.general.isAuth
   };
};

export default Signin = connect(mapStateToProps, actions)(Signin);