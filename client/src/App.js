import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

// Importar componentes
import Landing from './views/Landing/Landing';
import Home from './views/Home/Home';
import Detail from './views/Detail/Detail';
import Form from './views/Form/Form';
import Nav from './components/Nav/Nav';

import './App.css';

function App() {
  console.log('🚀 App.js montado - React Router activo');
  
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Switch>
            {/* RUTA LANDING (exact path) */}
            <Route exact path="/">
              <Landing />
            </Route>
            
            {/* RUTA HOME */}
            <Route path="/home">
              <Nav />
              <Home />
            </Route>
            
            {/* RUTA DETAIL */}
            <Route path="/detail/:id">
              <Nav />
              <Detail />
            </Route>
            
            {/* RUTA FORM */}
            <Route path="/create">
              <Nav />
              <Form />
            </Route>
            
            {/* REDIRECCIÓN POR DEFECTO */}
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;