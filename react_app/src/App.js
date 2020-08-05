import React, {useState} from 'react';
import About from './pages/about'
import Home from './pages/home'
import Login from './pages/login'
import Nav from './components/nav'
import SignUp from './pages/sign_up'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import './App.css';
import jwt from 'jwt-decode'
import axios from 'axios'
import {user_data} from './redux'

function App() {

  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.session.isLoggedIn);
  const [isAuthenticatedUserData, setisAuthenticatedUserData] = useState(false)
  
  const getAuthenticatedData = async () => {
    const token_resp = await getValidToken();
    if(isLoggedIn){
      return isLoggedIn&&token_resp
    }else{
      const resp = await axios.get("/get_authenticated_user_information");
      const logged_in = await resp.data.is_logged_in;
      const auth = logged_in && token_resp
      dispatch(user_data(resp.data.user_data))
      setisAuthenticatedUserData(auth)
      return auth
    }
}
  const getValidToken = async () => {
    const token = localStorage.getItem("userAccessToken");
    if(!token){
      return false;
    }
    let expiry_date = jwt(token);
    let curr_time = new Date().getTime()/1000;
    if (expiry_date < curr_time){
      return false;
    }
    return true
  }

  const PrivateRoute = ({component: Component, ...rest}) => {
    return (
      <Route
        {...rest}
        render={(props) => getAuthenticatedData()
          ? <Component {...props} />
          : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
      />
    )
  }

  return (
    
    <Router>
    <div>
     <Switch>
      <Route path="/" exact component={Login}/>
      <Route path="/login" exact component={Login}/>
      <Route path="/signup" exact component={SignUp}/>
      <PrivateRoute path="/about" exact component={About}/>
      <PrivateRoute path="/home" exact component={Home}/>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
   