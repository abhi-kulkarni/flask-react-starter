import React from 'react';
import Shop from './pages/shop'
import About from './pages/about'
import Home from './pages/home'
import Item from './pages/item'
import Login from './pages/login'
import SignUp from './pages/sign_up'
import Nav from './components/nav'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import {useSelector} from 'react-redux'
import './App.css';

function App() {

  const isLoggedIn = useSelector(state => state.session.isLoggedIn)

  return (
    <Router>
    <div>
     {isLoggedIn?<Nav/>:''}
     <Switch>
      <Route path="/" exact component={Login}/>
      <Route path="/login" exact component={Login}/>
      <Route path="/signup" exact component={SignUp}/>
      <Route path="/home" exact component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/shop" exact component={Shop}/>
      <Route path="/shop/:id" component={Item}/>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
