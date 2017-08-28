import {
   CHANGE_BALANS,
   SIGN_IN,
   LOG_OUT,
   SET_TROBBER
} from '../constants/actions';

const changeBalans = (state, data) => {
   let newState = Object.assign({}, state);
   newState.balans += data.delta;
   return newState;
};

const logIn = (state, data) => {
   let newState = Object.assign({}, state);
   newState.isAuth = true;
   newState.isExecutor =  data.isExecutor;
   newState.nickname = data.nickname;
   newState.balans = data.balans;
   return newState;
};

const logOut = (state, data) => {
   return {
      isAuth: false
   };
};

const setTrobber = (state, data) => {
   let newState = Object.assign({}, state);
   newState.hasTrobber = data.status;
   return newState;
};

export default function(state = {}, action) {
   switch (action.type) {
      case CHANGE_BALANS:
         return changeBalans(state, action.data);
      case SIGN_IN:
         return logIn(state, action.data);
      case LOG_OUT:
         return logOut(state, action.data);
      case SET_TROBBER:
         return setTrobber(state, action.data);
      default:
         return state;
   }
}