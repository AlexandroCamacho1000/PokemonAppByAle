import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Landing from './views/Landing/Landing';
import Home from './views/Home/Home';
import Detail from './views/Detail/Detail';
import Form from './views/Form/Form';
import Nav from './components/Nav/Nav';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/">
              <Landing />
            </Route>
            
            <Route path="/home">
              <Nav />
              <Home />
            </Route>
            
            <Route path="/detail/:id">
              <Nav />
              <Detail />
            </Route>
            
            <Route path="/create">
              <Nav />
              <Form />
            </Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;