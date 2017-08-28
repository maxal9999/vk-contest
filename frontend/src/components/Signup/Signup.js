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
import './Signup.less';

class Signup extends Component {

   static propTypes = {
      isAuth: PropTypes.bool
   };

   state = {
      login: '',
      password: '',
      passwordDouble: ''
   };

   componentWillMount() {
      this.props.logOut();
   }

   handleSignup() {
      const login = this.state.login,
         pass = this.state.password,
         doublePas = this.state.passwordDouble;
      if (
         login &&
         pass &&
         doublePas &&
         doublePas === pass
      ) {
         this.props.signUp({
            login: this.state.login,
            password: this.state.password
         });
      }
   }

   onChange(field, value) {
      let state = {};
      state[field] = value;
      this.setState(state);
   }

   render() {
      return (
         <div className='Signup'>
            <div className='Signup__head'>Регистрация аккаунта</div>
            <div className='Signup__body'>
               <div className='Signup__form'>
                  <TextField
                     placeholder='Имя пользователя'
                     onChange={this.onChange.bind(this, 'login')}
                     hasAutofocus={true} />
                  <TextField
                     placeholder='Пароль'
                     onChange={this.onChange.bind(this, 'password')}
                     isPassword={true} />
                  <TextField
                     placeholder='Повторите пароль'
                     onChange={this.onChange.bind(this, 'passwordDouble')}
                     text={this.state.passwordDouble}
                     isPassword={true} />
                  <Button
                     caption='Зарегистрироваться'
                     isPrimary={true}
                     className='Signup__button'
                     onClick={::this.handleSignup} />
               </div>
               <Link className='Signup__switch'
                  to='signin'>У вас уже есть аккаунт?</Link>
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

export default Signup = connect(mapStateToProps, actions)(Signup);