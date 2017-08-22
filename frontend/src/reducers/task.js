import {
   OPEN_TASK,
   CLOSE_TASK,
   ADD_TASK,
   EXECUTE_TASK
} from '../constants/actions';

const setState = (state, newState) => {
   return newState;
};

const addTask = (state, data) => {
   let newState = Object.assign({}, state);
   return newState;
};

const executeTask = (state, data) => {
   let newState = Object.assign({}, state);
   return newState;
};

export default function(state = {}, action) {
   switch (action.type) {
      case 'SET_STATE':
         return setState(state, action.state);
      case ADD_TASK:
         return addTask(state, action.data);
      case EXECUTE_TASK:
         return executeTask(state, action.data);
      default:
         return state;
   }
}