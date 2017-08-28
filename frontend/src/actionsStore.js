import * as actionsLib from './constants/actions';
import DataService from './utils/DataService';
import withTrobber from './utils/withTrobber';

export function signIn(data) {
   return (dispatch, getState) => {
      withTrobber(dispatch, new DataService().call('signin', {
         method: 'POST',
         body: JSON.stringify(data)
      })).then(res => {
         dispatch({
            type: actionsLib.SIGN_IN,
            data: {
               nickname: data.login,
               isExecutor: false,
               balans: 1244.22
            }
         });
      }).catch(err => {
         dispatch({
            type: actionsLib.OPEN_MODAL,
            data: {
               type: 'alert',
               text: 'Неправильное имя пользователя или пароль!'
            }
         });
      });
   };
};

export function signUp(formData) {
   return (dispatch, getState) => {
      withTrobber(dispatch, new DataService().call('signup', {
         method: 'POST',
         body: JSON.stringify(formData)
      })).then(res => {
         dispatch({
            type: actionsLib.SIGN_IN,
            data: {
               nickname: formData.login,
               isExecutor: false,
               balans: 1244.22
            }
         });
      }).catch(err => {
         dispatch({
            type: actionsLib.OPEN_MODAL,
            data: {
               type: 'alert',
               text: err.message || err
            }
         });
      });;
   };
};

export function logOut(data) {
   return {
      type: actionsLib.LOG_OUT,
      data: {}
   };
};

export function setTrobber(data) {
   return {
      type: actionsLib.SET_TROBBER,
      data: {
         status: data.status
      }
   };
};

export function changeBalans(data) {
   return (dispatch, getState) => {
      withTrobber(dispatch, new DataService().call('balance/change', {
         method: 'POST',
         body: JSON.stringify(data)
      })).then(res => {
         dispatch({
            type: actionsLib.CHANGE_BALANS,
            data: {
               delta: data.delta
            }
         });
      }).catch(err => {
         dispatch({
            type: actionsLib.OPEN_MODAL,
            data: {
               type: 'alert',
               text: err.message || err
            }
         });
      });
   };
};

export function openOrder(id) {
   return {
      type: actionsLib.OPEN_MODAL,
      data: {
         type: 'order',
         id
      }
   };
};

export function addOrder(data) {
   return (dispatch, getState) => {
      withTrobber(dispatch, new DataService().call('order/new', {
         method: 'POST',
         body: JSON.stringify(data)
      })).then(res => {
         dispatch({
            type: actionsLib.ADD_ORDER,
            data: data
         });
      }).catch(err => {
         dispatch({
            type: actionsLib.OPEN_MODAL,
            data: {
               type: 'alert',
               text: err.message || err
            }
         });
      });;
   };
};

export function getOrderInWork(id) {
   return (dispatch, getState) => {
      withTrobber(dispatch, new DataService().call('order/get_in_work', {
         method: 'POST',
         body: JSON.stringify({
            id
         })
      })).then(res => {
         dispatch({
            type: actionsLib.UPDATE_ORDER,
            data: {
               id,
               status: 1,
               executor: 777,
               workStart: new Date()
            }
         });
      }).catch(err => {
         dispatch({
            type: actionsLib.OPEN_MODAL,
            data: {
               type: 'alert',
               text: err.message || err
            }
         });
      });;
   };
};

export function doneOrder(id) {
   return (dispatch, getState) => {
      withTrobber(dispatch, new DataService().call('order/done', {
         method: 'POST',
         body: JSON.stringify({
            id
         })
      })).then(res => {
         dispatch({
            type: actionsLib.UPDATE_ORDER,
            data: {
               id,
               status: 2,
               executor: 777,
               lifeEnd: new Date()
            }
         });
      }).catch(err => {
         dispatch({
            type: actionsLib.OPEN_MODAL,
            data: {
               type: 'alert',
               text: err.message || err
            }
         });
      });;
   };
};

export function closeModal(id) {
   return {
      type: actionsLib.CLOSE_MODAL,
      id
   };
};

export function showAlert(text) {
   return {
      type: actionsLib.OPEN_MODAL,
      data: {
         type: 'alert',
         text
      }
   };
};