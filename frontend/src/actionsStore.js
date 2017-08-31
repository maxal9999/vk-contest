import * as actionsLib from './constants/actions';
import DataService from './utils/DataService';
import withTrobber from './utils/withTrobber';

/* Регистрация */
export function signUp(formData) {
   return (dispatch, getState) => {
      withTrobber(dispatch, new DataService().call('signup', {
         method: 'POST',
         body: JSON.stringify(formData)
      })).then(res => {
         window.document.cookie = `token_id=${res.token_id}`;
         dispatch({
            type: actionsLib.SIGN_IN,
            data: {
               nickname: res.nickname,
               author_id: res.author_id,
               balans: res.balans
            }
         });
      }).catch(err => {
         dispatch({
            type: actionsLib.OPEN_MODAL,
            data: {
               type: 'alert',
               text: err
            }
         });
      });;
   };
};
/* Авторизация */
export function signIn(data) {
   return (dispatch, getState) => {
      withTrobber(dispatch, new DataService().call('signin', {
         method: 'POST',
         body: JSON.stringify(data)
      })).then(res => {
         window.document.cookie = `token_id=${res.token_id}`;
         dispatch({
            type: actionsLib.SIGN_IN,
            data: {
               nickname: res.nickname,
               author_id: res.author_id,
               balans: res.balans
            }
         });
      }).catch(err => {
         dispatch({
            type: actionsLib.OPEN_MODAL,
            data: {
               type: 'alert',
               text: err
            }
         });
      });
   };
};
/* Выход */
export function logOut(data) {
   return (dispatch, getState) => {
      withTrobber(dispatch, new DataService().call('signout', {
         method: 'POST',
         body: JSON.stringify({})
      })).then(res => {
         window.document.cookie = `token_id=''`;
         dispatch({
            type: actionsLib.LOG_OUT,
            data: {}
         });
      }).catch(err => {
         dispatch({
            type: actionsLib.OPEN_MODAL,
            data: {
               type: 'alert',
               text: err
            }
         });
      });;
   };
};
/* Изменнеие баланса */
export function changeBalans(data) {
   return (dispatch, getState) => {
      withTrobber(dispatch, new DataService().call('balance/change', {
         method: 'POST',
         body: JSON.stringify(data)
      })).then(res => {
         dispatch({
            type: actionsLib.CHANGE_BALANS,
            data: {
               balans: res.balans
            }
         });
      }).catch(err => {
         dispatch({
            type: actionsLib.OPEN_MODAL,
            data: {
               type: 'alert',
               text: err
            }
         });
      });
   };
};
/* Открывает карточку заказа */
export function openOrder(id) {
   return {
      type: actionsLib.OPEN_MODAL,
      data: {
         type: 'order',
         id
      }
   };
};
/* Создает заказ */
export function addOrder(data) {
   return (dispatch, getState) => {
      withTrobber(dispatch, new DataService().call('order/new', {
         method: 'POST',
         body: JSON.stringify(data)
      })).then(res => {
         dispatch({
            type: actionsLib.ADD_ORDER,
            data: res.order
         });
         dispatch({
            type: actionsLib.CHANGE_BALANS,
            data: {
               balans: res.balans
            }
         });
      }).catch(err => {
         dispatch({
            type: actionsLib.OPEN_MODAL,
            data: {
               type: 'alert',
               text: err
            }
         });
      });;
   };
};
/* Взять заказ в работу */
export function getOrderInWork(id) {
   return (dispatch, getState) => {
      withTrobber(dispatch, new DataService().call('order/in_work', {
         method: 'POST',
         body: JSON.stringify({
            id
         })
      })).then(res => {
         dispatch({
            type: actionsLib.UPDATE_ORDER,
            data: {
               id,
               status: 1,
               executor: res.executor_id,
               workStart: res.start_date
            }
         });
         dispatch({
            type: actionsLib.REMOVE_ORDER_FROM_SHOW,
            data: {
               id
            }
         });
      }).catch(err => {
         dispatch({
            type: actionsLib.OPEN_MODAL,
            data: {
               type: 'alert',
               text: err
            }
         });
      });;
   };
};
/* Завершить заказ */
export function doneOrder(data) {
   return (dispatch, getState) => {
      withTrobber(dispatch, new DataService().call('order/done', {
         method: 'POST',
         body: JSON.stringify(data)
      })).then(res => {
         dispatch({
            type: actionsLib.UPDATE_ORDER,
            data: {
               id: data.id,
               status: 2,
               end_date: res.order.end_date,
               comment_txt: res.order.comment_txt
            }
         });
         dispatch({
            type: actionsLib.CHANGE_BALANS,
            data: {
               balans: res.balans
            }
         });
      }).catch(err => {
         dispatch({
            type: actionsLib.OPEN_MODAL,
            data: {
               type: 'alert',
               text: err.message || err
            }
         });
      });;
   };
};
/* Получить список заказов с фильтром */
export function getOrdersList(filter) {
   return (dispatch, getState) => {
      if(!filter.page) {
         dispatch({
            type: actionsLib.SET_SHOW_LIST,
            data: {
               showList: [],
               page: 0,
               hasNext: false
            }
         });
      }
      withTrobber(dispatch, new DataService().call('order/list', {
         method: 'POST',
         body: JSON.stringify({
            filter
         })
      })).then(res => {
         let showIds = res.orders.map(_order => {
            let order = _order;
            order.id = order.order_id;
            dispatch({
               type: actionsLib.UPDATE_ORDER,
               data: order
            });
            return order.id;
         });
         dispatch({
            type: actionsLib.SET_SHOW_LIST,
            data: {
               showList: showIds,
               page: filter.page,
               hasNext: res.has_next
            }
         });
      }).catch(err => {
         dispatch({
            type: actionsLib.OPEN_MODAL,
            data: {
               type: 'alert',
               text: err
            }
         });
      });
   };
};
/* Активирует нужный фильтр */
export function activateFilter(filter) {
   return {
      type: actionsLib.ACTIVATE_FILTER,
      data: {
         type: 'order',
         filter: filter
      }
   };
};
/* Показать заглушку-ожиданчик */
export function setTrobber(data) {
   return {
      type: actionsLib.SET_TROBBER,
      data: {
         status: data.status
      }
   };
};
/* Закрыть модальный диалог по идентификатору */
export function closeModal(id) {
   return {
      type: actionsLib.CLOSE_MODAL,
      id
   };
};
/* Показать алерт */
export function showAlert(text) {
   return {
      type: actionsLib.OPEN_MODAL,
      data: {
         type: 'alert',
         text
      }
   };
};