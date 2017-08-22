import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import {
   Link
} from 'react-router-dom';
import TextField from '../TextField/TextField';
import Button from '../Button/Button';
import './Signup.less';

export default class Signup extends Component {

   static propTypes = {};

   handleSignup() {

   }

   render() {
      return (
         <div className='Signup'>
            <div className='Signup__head'>Регистрация аккаунта</div>
            <div className='Signup__body'>
               <div className='Signup__form'>
                  <TextField
                     placeholder='Имя пользователя'
                     hasAutofocus={true} />
                  <TextField
                     placeholder='Пароль'
                     isPassword={true} />
                  <TextField
                     placeholder='Повторите пароль'
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
         </div>
      );
   }
}