import {
   OPEN_ORDER,
   CLOSE_ORDER,
   ADD_ORDER,
   EXECUTE_ORDER
} from '../constants/actions';

const addOrder = (state, data) => {
   let newState = Object.assign({}, state);
   return newState;
};

export default function(state = {}, action) {
   switch (action.type) {
      case ADD_ORDER:
         return addOrder(state, action.data);
      default:
         return state;
   }
}