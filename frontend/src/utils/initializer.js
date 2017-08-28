let basicData = {
   general: {
      isAuth: false,
      id: 1,
      isExecutor: false,
      nickname: '',
      balans: 0,
      hasTrobber: false
   },
   modal: {
      active: {}
   },
   order: {
      store: {
         1: {
            id: 1,
            client: 12,
            lifeStart: new Date(),
            title: 'Мой первый заказ',
            descr: 'Он лучший самый и интересный',
            price: 2500,
            workStart: null,
            lifeEnd: null,
            executor: null,
            status: 0
         },
         2: {
            id: 2,
            client: 123,
            lifeStart: new Date(),
            title: 'Мой второй заказ',
            descr: 'Он похуже конечно, но тоже ничего',
            price: 3500,
            workStart: null,
            lifeEnd: null,
            executor: null,
            status: 0
         },
         3: {
            id: 3,
            client: 23,
            lifeStart: new Date(),
            title: 'Еще заказец',
            descr: 'Вообще ниочем, пусть где-то там валяется',
            price: 500,
            workStart: null,
            lifeEnd: null,
            executor: null,
            status: 0
         }
      }
   },
   user: {
      store: {

      }
   }
};

const getInitialData = function(basic) {
   let data = basic;
   if(window.initialData) {
      data = Object.assign({}, window.initialData);
      data.isAuth = true;
   }
   return data;
};

export default function() {
   basicData.general = getInitialData(basicData.general);
   return basicData;
};