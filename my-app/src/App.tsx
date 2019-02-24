import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Switch, Route, Redirect } from 'react-router';

import store from './common/store';
import browserHistory from './common/history';
import { Grid, CssBaseline } from '@material-ui/core';
import { HashRouter } from 'react-router-dom';
import { MyAppBar } from './components/AppBar';
import { BottomAppBar } from './components/BottomAppBar';
import { PageNoMatch } from './pages/PageNoMatch';
import { PagePay } from './pages/PagePay';
import { PageLogin } from './pages/PageLogin';
import { PageAccount } from './pages/PageAccount';
import { PrivateRoute } from './pages/PrivateRoute';
import { MyGoogleLogin } from './components/MyGoogleLogin';
import { PageTransfer } from './pages/PageTransfer';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Grid
            container
            direction='column'
            justify="space-between"
            alignItems="stretch">
            <CssBaseline />
            <HashRouter>
              <div style={{ height: '100%', paddingBottom: '60px' }}>
                <MyAppBar />
                <Switch>
                  <Route exact path="/" render={() => <Redirect to={{ pathname: '/pay' }} />} />
                  <Route path="/login" component={PageLogin} />
                  <PrivateRoute path="/paper/:code?" component={PageNoMatch} />
                  <PrivateRoute path="/account" component={PageAccount} />
                  <PrivateRoute path="/pay" component={PagePay} />
                  <Route path="/claim/:code?" component={PageNoMatch} />
                  <PrivateRoute path="/transfer" component={PageTransfer} />
                  <Route path="/share/:address?" render={(props: any) => <Redirect to={{ pathname: '/transfer', state: props.match.params.address }} />} />
                  <Route component={PageNoMatch} />
                </Switch>
                <BottomAppBar />
              </div>
            </HashRouter>
            <div style={{ display: 'none' }}>
              <MyGoogleLogin />
            </div>
          </Grid>
        </Router>
      </Provider>
    );
  }
}

export default App;
