import appSettings from '../constants/appSettings';

export default class DataService {

   constructor(cfg = {}) {
      this.endpoint = cfg.endpoint || `/api/${appSettings.apiVer}/`;
   }

   call(path, _params) {
      let params = _params;
      params.credentials = 'same-origin';
      return fetch(`${this.endpoint}${path}`, params).then(res => {
         if(res.ok) {
            return res.json().then(data => {
               if(data.error) {
                  return Promise.reject(data.error);
               } else {
                  return data;
               }
            });
         }
         return Promise.reject(res.statusText);
      });
   }
}