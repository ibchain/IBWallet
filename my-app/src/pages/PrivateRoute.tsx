import * as React from 'react'
import { Route, Redirect } from "react-router-dom"
import { connect } from 'react-redux';
import { Paper, Typography, withStyles } from '@material-ui/core';
import { haveLoggedIn } from '../common/localStorage';
import { UserState } from '../common/reducer';
// import AuthService from './services/AuthService'  // ログインチェックを行うサービス.

let debug = require('debug')
let log = debug('MyRoute');
log.log = console.log.bind(console);

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
  isLoggedIn: boolean
  isLogout: boolean
}

type MyProps = { classes: any, component: any } & MapStateProps

interface MyStates {
  timeout: boolean
}


class MyRoute extends React.Component<MyProps, MyStates> {

  private timer: any

  constructor(props: MyProps) {
    super(props)
    this.state = {
      timeout: false
    }

    this.clearTimer = this.clearTimer.bind(this)
  }

  componentDidMount() {
    log('componentDidMount')

    const { loggedIn, lastLoggedIn } = haveLoggedIn()
    log('componentDidMount', loggedIn, lastLoggedIn)

    // const { isLoggedIn } = this.props
    if (!loggedIn) {
      this.timer = window.setTimeout(() => {
        const { isLoggedIn } = this.props
        if (!isLoggedIn) {
          log('timeout: true')
          this.setState({ timeout: true })
        } else {
          log('timeout: false')
        }
      }, 5000)
    }
  }

  componentWillUnmount() {
    log('componentWillUnmount')
    this.clearTimer()
  }

  clearTimer() {
    log('clearTimeout')
    if (!!this.timer) {
      log('clearTimeout !!this.timer === true')
      window.clearTimeout(this.timer)
      this.timer = undefined
    }
  }

  render() {

    log('render', this.props)
    const { isLogout } = this.props
    // 過去にログイン成功していない場合はログイン画面にリダイレクトする
    // 過去にログイン成功している場合は、ログイン処理の結果を待つ
    if (isLogout) {
      this.clearTimer()
      return <Redirect to={{ pathname: '/login', state: { from: (this.props as any).location } }} />
    }


    const { isLoggedIn } = this.props
    const { timeout } = this.state
    // ログインチェック前なら、ローディングを表示.
    if (!isLoggedIn && !timeout) {
      const { classes } = this.props

      return (
        < Paper className={classes.root} elevation={1} >
          <Typography variant="h5" component="h3" style={{ paddingBottom: '20px' }}>
            ようこそ IB Wallet へ！！
          </Typography>
          <Typography variant="h5" component="h3" style={{ paddingBottom: '20px' }}>
            ログイン処理中です。
          </Typography>
        </Paper >
      )
    }

    this.clearTimer()
    const { component: Component, ...rest } = this.props
    return (
      <Route {...rest} render={() => {
        // 過去にログイン成功しているが、ログイン処理がタイムアウトした場合はログイン画面にリダイレクト.
        // ログイン処理が失敗した場合はタイムアウトを待つ（TODO: 即時ログイン画面に遷移できないか？）
        if (timeout) {
          return <Redirect to={{ pathname: '/login', state: { from: (this.props as any).location } }} />
        }
        // ログイン処理が成功した場合
        return <Component {...this.props} />
      }}
      />
    )
  }
}

// export default PrivateRoute

const mapState = (state: UserState, routerProps: any): MapStateProps => {
  let { user } = state
  log("mapState", user, routerProps)
  return ({
    isLoggedIn: user.isLoggedIn,
    isLogout: user.isLogout,
  })
}

/** 資産表示コンポーネント */
export const PrivateRoute = connect(mapState)(withStyles(styles)(MyRoute))
