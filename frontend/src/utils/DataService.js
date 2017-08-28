import appSettings from '../constants/appSettings';

export default class DataService {

   constructor(cfg = {}) {
      this.endpoint = cfg.endpoint || `/api/${appSettings.apiVer}/`;
   }

   call(path, _params) {
      if (process.env.NODE_ENV === 'production') {
         let params = _params;
         params.credentials = 'same-origin';
         return fetch(`${this.endpoint}${path}`, params).then(res => {
            if(res.ok) {
               return res.json();
            }
            return Promise.reject(res.statusText);
         });
      } else {
         return new Promise(res => {
            setTimeout(res, 500);
         });
      }
   }
}