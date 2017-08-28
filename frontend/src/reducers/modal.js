import {
   OPEN_MODAL,
   CLOSE_MODAL
} from '../constants/actions';
import nanoid from 'nanoid';

const openModal = (state, data) => {
   let newState = Object.assign({}, state);
   newState.active[nanoid()] = {
      id: data.id,
      type: data.type,
      data
   };
   return newState;
};

const closeModal = (state, id) => {
   let newState = Object.assign({}, state);
   delete newState.active[id];
   return newState;
};

export default function(state = {}, action) {
   switch (action.type) {
      case OPEN_MODAL:
         return openModal(state, action.data);
      case CLOSE_MODAL:
         return closeModal(state, action.id);
      default:
         return state;
   }
};