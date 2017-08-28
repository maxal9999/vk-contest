import {
   combineReducers
} from 'redux';
import order from './order';
import user from './user';
import general from './general';
import modal from './modal';

export default combineReducers({
   order,
   user,
   general,
   modal
});