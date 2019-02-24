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
                  <Route path="/paper/:code?" component={PageNoMatch} />
                  <Route path="/account" component={PageAccount} />
                  <Route path="/pay" component={PagePay} />
                  <Route path="/claim/:code?" component={PageNoMatch} />
                  <Route path="/transfer" component={PageNoMatch} />
                  <Route path="/share/:address?" render={(props: any) => <Redirect to={{ pathname: '/transfer', state: props.match.params.address }} />} />
                  <Route component={PageNoMatch} />
                </Switch>
                <BottomAppBar />
              </div>
            </HashRouter>
          </Grid>
        </Router>
      </Provider>
    );
  }
}

export default App;
