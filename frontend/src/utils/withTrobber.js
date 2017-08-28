import {
   SET_TROBBER
} from '../constants/actions';

export default function(dispatch, promise) {
   dispatch({
      type: SET_TROBBER,
      data: {
         status: true
      }
   });
   return promise.then(res => {
      dispatch({
         type: SET_TROBBER,
         data: {
            status: false
         }
      });
      return res;
   }).catch(err => {
      dispatch({
         type: SET_TROBBER,
         data: {
            status: false
         }
      });
      return Promise.reject(err);
   });
};