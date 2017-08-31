let basicData = {
   general: {
      isAuth: false,
      author_id: -1,
      nickname: '',
      balans: '0',
      hasTrobber: false
   },
   modal: {
      active: {}
   },
   order: {
      filter: 'all',
      showList: [],
      page: 0,
      hasNext: false,
      heedLoad: false,
      store: {}
   },
   user: {
      store: {}
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
   if(basicData.general.author_id) {
      basicData.user.store[basicData.general.author_id] = {
         author_id: basicData.general.author_id,
         login: basicData.general.nickname
      };
   }
   return basicData;
};