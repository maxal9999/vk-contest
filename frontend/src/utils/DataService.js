import appSettings from '../constants/appSettings';

export default class DataService {

   constructor(cfg = {}) {
      this.endpoint = cfg.endpoint || `/api/${appSettings.apiVer}/`;
   }

   call(path, _params) {
      let params = _params;
      params.credentials = 'same-origin';
      return fetch(`${this.endpoint}${path}`, params);
   }
}