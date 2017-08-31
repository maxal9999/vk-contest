import {
   ADD_USERS
} from '../constants/actions';

const addUsers = (state, data) => {
   let newState = Object.assign({}, state);
   data.list.forEach(item => {
      newState.store[item.author_id] = {
         author_id: item.author_id,
         login: item.login
      };
   });
   return newState;
};

export default function(state = {}, action) {
   switch (action.type) {
      case ADD_USERS:
         return addUsers(state, action.data);
      default:
         return state;
   }
}