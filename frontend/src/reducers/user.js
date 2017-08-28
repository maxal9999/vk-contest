import {
   ADD_USER
} from '../constants/actions';

const addUser = (state, data) => {
   let newState = Object.assign({}, state);
   return newState;
};

export default function(state = {}, action) {
   switch (action.type) {
      case ADD_USER:
         return addUser(state, action.data);
      default:
         return state;
   }
}