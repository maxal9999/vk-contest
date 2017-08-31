import {
   ADD_ORDER,
   UPDATE_ORDER,
   REMOVE_ORDER_FROM_SHOW,
   ACTIVATE_FILTER,
   SET_SHOW_LIST
} from '../constants/actions';

const addOrder = (state, data) => {
   let newState = Object.assign({}, state),
      currentItem = {
         order_id: data.order_id,
         customer_id: data.customer_id,
         create_date: serializeField('create_date', data.create_date),
         title: data.title,
         descr: data.descr,
         price: data.price,
         status: 0,
         comment_txt: '',
         start_date: null,
         end_date: null,
         executor_id: null,
      };
   newState.store[data.order_id] = currentItem;
   return newState;
};

const serializeField = (key, value) => {
   switch(key) {
      case 'create_date':
      case 'end_date':
      case 'start_date':
         return value && new Date(value) || null;
      default:
         return value;
   }
};

const updateOrder = (state, data) => {
   let newState = Object.assign({}, state);
   if(!newState.store[data.id]) {
      newState.store[data.id] = {};
   }
   let currentItem = newState.store[data.id];
   Object.keys(data).forEach(key => {
      currentItem[key] = serializeField(key, data[key]);
   });
   return newState;
};

const activateFilter = (state, data) => {
   let newState = Object.assign({}, state);
   newState.filter = data.filter;
   newState.heedLoad = true;
   return newState;
};

const setShowList = (state, data) => {
   let newState = Object.assign({}, state);
   newState.page = data.page;
   newState.hasNext = data.hasNext;
   newState.heedLoad = false;
   if(newState.page) {
      newState.showList.push.apply(newState.showList, data.showList);
   } else {
      newState.showList = data.showList;
   }
   return newState;
};

const removeOrderFromShow = (state, data) => {
   let newState = Object.assign({}, state);
   for(let i = 0; i < newState.showList.length; i++) {
      if(data.id === newState.showList[i]) {
         newState.showList.splice(i, 1);
         break;
      }
   }
   return newState;
};

export default function(state = {}, action) {
   switch (action.type) {
      case ADD_ORDER:
         return addOrder(state, action.data);
      case UPDATE_ORDER:
         return updateOrder(state, action.data);
      case ACTIVATE_FILTER:
         return activateFilter(state, action.data);
      case SET_SHOW_LIST:
         return setShowList(state, action.data);
      case REMOVE_ORDER_FROM_SHOW:
         return removeOrderFromShow(state, action.data);
      default:
         return state;
   }
}