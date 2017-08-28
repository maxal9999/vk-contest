import * as actionsLib from './constants/actions';
import DataService from './utils/DataService';

export function signIn(data) {
   return (dispatch, getState) => {
      dispatch({
         type: actionsLib.SET_TROBBER,
         data: {
            status: true
         }
      });
      setTimeout(_ => {
         dispatch({
            type: actionsLib.SET_TROBBER,
            data: {
               status: false
            }
         });
         dispatch({
            type: actionsLib.SIGN_IN,
            data: {
               nickname: data.login,
               isExecutor: false,
               balans: 1244.22
            }
         });
      }, 1000)
   };
};

export function logOut(data) {
   return {
      type: actionsLib.LOG_OUT,
      data: {}
   };
};

export function signUp(formData) {
   return (dispatch, getState) => {
      dispatch({
         type: actionsLib.SET_TROBBER,
         data: {
            status: true
         }
      });
      setTimeout(_ => {
         dispatch({
            type: actionsLib.SET_TROBBER,
            data: {
               status: false
            }
         });
         dispatch({
            type: actionsLib.SIGN_IN,
            data: {
               nickname: formData.login,
               isExecutor: false,
               balans: 1244.22,
            }
         });
      }, 1000);
   };
   // return (dispatch, getState) => {
   //    // dispatch({
   //    //    type: actionsLib.PERFORM_SEARCH_PROJECT,
   //    //    id: chooserId
   //    // });
   //    new DataService().call('signup', {
   //       method: 'POST',
   //       body: JSON.stringify(formData)
   //    }).then(resp => {
   //       // dispatch({
   //       //    type: actionsLib.SEARCH_PROJECT,
   //       //    id: chooserId,
   //       //    entities: filtred
   //       // });
   //    });
   // };
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
   return {
      type: actionsLib.CHANGE_BALANS,
      data: {
         delta: data.delta
      }
   };
};