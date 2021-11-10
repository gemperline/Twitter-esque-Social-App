import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
// import { createTheme } from '@material-ui/core/styles';
import { unstable_createMuiStrictModeTheme as createTheme } from '@material-ui/core';
import jwtDecode from 'jwt-decode';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

// Components
import Navbar from './components/Navbar';
import themeObject from './util/theme'
import AuthRoute from './util/AuthRoute';

// Pages
import home from './pages/home';
import login from './pages/login';
import register from './pages/register';
import axios from 'axios';

const theme = createTheme(themeObject);

const token = localStorage.FBIdToken;

if (token)
{
  const decodedToken = jwtDecode(token);    // decoding gives token's "exp (expiration) value", among onthers
  console.log(decodedToken);
  if (decodedToken.exp * 1000 < Date.now())  // check for expired token 
  {
    store.dispatch(logoutUser());
    window.location.href = '/login';
  }
  else
  {
    store.dispatch({ type: SET_AUTHENTICATED });  // sets 'authenticated' to true
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
};

class App extends Component {
  render() {
    return (
     <MuiThemeProvider theme={theme}>
       <Provider store={store}>       
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={home} />
                <AuthRoute exact path="/login" component={login} />
                <AuthRoute exact path="/register" component={register} />
              </Switch>
            </div>
          </Router>
        </Provider>
     </MuiThemeProvider>
    );
  }
};
 
export default App;
