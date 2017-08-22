import React from 'react';
import ReactDOM from 'react-dom';
import {
   createStore,
   applyMiddleware
} from 'redux';
import {
   Provider
} from 'react-redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import {
   BrowserRouter as Router,
   Route
} from 'react-router-dom';
import rootReducer from './reducers/rootReducer';
import App from './components/App/App';
import './index.less';

const store = createStore(rootReducer, {}, applyMiddleware(thunk));

ReactDOM.render(
   <Provider store={ store }>
      <Router history={ createHistory() }>
         <Route path='/' component={App} />
      </Router>
   </Provider>
   ,
   document.getElementById('app')
);