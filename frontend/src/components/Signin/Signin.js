import React, {
   Component
} from 'react';
import PropTypes from 'prop-types';
import {
   Link
} from 'react-router-dom';
import TextField from '../TextField/TextField';
import Button from '../Button/Button';
import './Signin.less';

export default class Signin extends Component {

   static propTypes = {};

   handleSignin() {

   }

   render() {
      return (
         <div className='Signin'>
            <div className='Signin__head'>Вход в аккаунт</div>
            <div className='Signin__body'>
               <div className='Signin__form'>
                  <TextField
                     placeholder='Имя пользователя'
                     hasAutofocus={true} />
                  <TextField
                     placeholder='Пароль'
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
         </div>
      );
   }
}