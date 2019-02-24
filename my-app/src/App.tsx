import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Switch, Route, Redirect } from 'react-router';

import store from './common/store';
import browserHistory from './common/history';
import { Grid, CssBaseline } from '@material-ui/core';
import { HashRouter } from 'react-router-dom';
import { PageNoMatch } from './pages';

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
                <Switch>
                  <Route path="/paper/:code?" component={PageNoMatch} />
                  <Route path="/login" component={PageNoMatch} />
                  <Route path="/share/:address?" render={(props: any) => <Redirect to={{ pathname: '/transfer', state: props.match.params.address }} />} />
                  <Route exact path="/" component={PageNoMatch} />
                  <Route path="/account" component={PageNoMatch} />
                  <Route path="/pay" component={PageNoMatch} />
                  <Route path="/claim/:code?" component={PageNoMatch} />
                  <Route path="/transfer" component={PageNoMatch} />
                  <Route component={PageNoMatch} />
                </Switch>
              </div>
            </HashRouter>
          </Grid>
        </Router>
      </Provider>
    );
  }
}

export default App;
