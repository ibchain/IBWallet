import * as React from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Paper, withStyles, Typography } from '@material-ui/core'
import { UserState, State } from '../common/reducer';
import { MyGoogleLogin } from '../components/MyGoogleLogin';

let debug = require('debug')
let log = debug('[PAGE]{/login}');

const styles = (theme: any) => {
  return ({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      textAlign: 'center',
      marginTop: theme.spacing.unit * 4,
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2,
    },
  });
}

interface MapStateProps {
  user: UserState
}

type MyProps = MapStateProps & { classes: any }
interface MyState { }

class Login extends React.Component<MyProps, MyState> {

  render() {
    const { isLoggedIn } = this.props.user
    if (isLoggedIn) {
      return <Redirect to={{ pathname: '/pay' }} />
    }
    const { classes } = this.props
    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h5" component="h3" style={{ paddingBottom: '20px' }}>
          ようこそ IB Wallet へ！！
        </Typography>
        <MyGoogleLogin />
      </Paper>
    )
  }
}

const mapState = (state: State): MapStateProps => {
  log("mapState", state)
  return ({
    user: state.user
  })
}

export const PageLogin = connect(mapState)(withStyles(styles)(Login));
