import {
   ADD_ORDER,
   UPDATE_ORDER
} from '../constants/actions';

const addOrder = (state, data) => {
   let newState = Object.assign({}, state);
   let fakeId = Math.random();
   newState.store[fakeId] = data;
   newState.store[fakeId].id = fakeId;
   newState.store[fakeId].lifeStart = new Date();
   newState.store[fakeId].client = 12;
   return newState;
};

const updateOrder = (state, data) => {
   let newState = Object.assign({}, state);
   if(newState.store[data.id]) {
      Object.keys(data).forEach(key => {
         newState.store[data.id][key] = data[key];
      });
   } else {
      newState.store[data.id] = data;
   }
   return newState;
};

export default function(state = {}, action) {
   switch (action.type) {
      case ADD_ORDER:
         return addOrder(state, action.data);
      case UPDATE_ORDER:
         return updateOrder(state, action.data);
      default:
         return state;
   }
}