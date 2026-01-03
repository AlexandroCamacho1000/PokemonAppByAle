import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

// Importamos los componentes
import Landing from './views/Landing/Landing';
const Home = () => <div>HOME PAGE (próximamente)</div>;
const Detail = () => <div>DETAIL PAGE (próximamente)</div>;
const Form = () => <div>FORM PAGE (próximamente)</div>;

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          {/* Ruta de Landing - SIN título ni navbar */}
          <Route exact path="/" component={Landing} />
          
          {/* Todas las demás rutas */}
          <Route>
            {/* Aquí puedes poner tu Navbar component cuando lo tengas */}
            <div className="main-routes">
              <h1>Henry Pokemon</h1>
              <nav>
                <a href="/">Landing</a> | 
                <a href="/home">Home</a> | 
                <a href="/detail/1">Detail</a> | 
                <a href="/create">Form</a>
              </nav>
              
              {/* Contenido específico de cada ruta */}
              <Switch>
                <Route exact path="/home" component={Home} />
                <Route exact path="/detail/:id" component={Detail} />
                <Route exact path="/create" component={Form} />
              </Switch>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;