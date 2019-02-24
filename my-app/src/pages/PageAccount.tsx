import * as React from 'react';
import { connect } from 'react-redux'
import { Grid, Typography, Theme, withStyles, Paper, Button, Dialog, Slide, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@material-ui/core';
import { GoogleLogout } from 'react-google-login';
import { UserState } from '../common/reducer';

const ReactCopyButtonWrapper = require('react-copy-button-wrapper')

let debug = require('debug')
let log = debug('[PAGE]{/account}');

interface MyProps {
  user: UserState
  classes: any
}
interface MyState {
  copyMessage?: string
  copyDiaglogOpen: boolean,
  logoutDialogOpen: boolean
}
const styles = (theme: Theme) => ({
  accountroot: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
  mypaper: {
    margin: theme.spacing.unit,
  }
})

class Page extends React.Component<MyProps, MyState> {

  constructor(props: MyProps) {
    super(props)
    this.state = {
      copyDiaglogOpen: false,
      logoutDialogOpen: false,
    }
  }

  render() {
    log('render')
    const { user, classes } = this.props
    const { address } = user
    // const handleOnSuccessLogout = this.props.actions.onSuccessGoogleLogout

    return (
      <Grid
        container
        direction='column'
        justify="space-between"
        alignItems="stretch"
        style={{ padding: '15px 15px 0px 15px' }}>
        <AddresPaper
          address={address}
          classes={classes}
          onAfterCopy={this.onAfterCopy}
          onErrorCopy={this.onErrorCopy} />
        <GooglePaper
          classes={classes}
          onClick={this.handleClickLogout} />
        <MyDialog
          copyDiaglogOpen={this.state.copyDiaglogOpen}
          copyMessage={this.state.copyMessage}
          handleClose={this.handleClose} />
        <LogoutDialog
          logoutDialogOpen={this.state.logoutDialogOpen}
          handleLogoutClose={this.handleLogoutClose}
          onSuccessLogout={this.handleOnSuccessLogout} />
      </Grid>
    )
  }

  handleOnSuccessLogout = () => {
    // new AmplifyBridge(store).logout();
  }

  openLogoutDialog = (open: boolean): void => {
    this.setState({ logoutDialogOpen: open })
  }
  handleClickLogout = () => {
    this.openLogoutDialog(true)
  }
  handleLogoutClose = () => {
    this.openLogoutDialog(false)
  }

  openCopyDialog = (open: boolean, message?: string): void => {
    this.setState({
      copyMessage: message,
      copyDiaglogOpen: open
    })
  }
  handleClose = () => {
    this.openCopyDialog(false)
  }
  onAfterCopy = () => {
    this.openCopyDialog(true, 'Address をクリップボードにコピーしました')
  }
  onErrorCopy = () => {
    this.openCopyDialog(true, 'クリップボードへのコピーが失敗しました')
  }
}

// -----------------

const mapState = (state: any): any => {
  log("mapState", state)
  return ({
    user: state.user
  })
}

const mapDispatch = (dispatch: any) => ({
  // actions: new ActionDispatcher(dispatch)
})

export const PageAccount = connect(mapState, mapDispatch)(withStyles(styles)(Page))

// -----------------

const LogoutDialog: React.FC<{ logoutDialogOpen: boolean, handleLogoutClose: () => void, onSuccessLogout: () => void }> = (props) => {
  const { logoutDialogOpen, handleLogoutClose, onSuccessLogout } = props
  return (
    <Dialog
      open={logoutDialogOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleLogoutClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{"ログアウト確認"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          ログアウトしますか？
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogoutClose} color="primary">
          キャンセル
        </Button>
        <GoogleLogout onLogoutSuccess={onSuccessLogout} render={(props?: { onClick: () => void }) => {
          return (
            <Button variant="contained" color="secondary" onClick={!!props ? props.onClick : () => { }}>
              ログアウト
            </Button>
          )
        }}>
        </GoogleLogout>
      </DialogActions>
    </Dialog>
  )
}

const MyDialog: React.FC<{ copyDiaglogOpen: boolean, handleClose: () => void, copyMessage?: string }> = (props) => {
  const { copyDiaglogOpen, handleClose, copyMessage } = props
  return (
    <Dialog
      open={copyDiaglogOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{"Information"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {copyMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
const AddresPaper: React.FC<{ address?: string, classes: any, onAfterCopy: () => void, onErrorCopy: () => void }> = (props) => {
  const { address, classes, onAfterCopy, onErrorCopy } = props
  return (
    <Grid item xs={12} className={classes.mypaper}>
      <Paper className={classes.accountroot} elevation={1}>
        <Typography variant="h5" component="h3">Address</Typography>
        <Typography component="p" style={{ wordWrap: 'break-word' }}>{address}</Typography>
        <ReactCopyButtonWrapper text={address} onAfterCopy={onAfterCopy} onErrorCopy={onErrorCopy}>
          <Button variant="outlined" className={classes.button}>Copy</Button>
        </ReactCopyButtonWrapper>
      </Paper>
    </Grid>
  )
}

const GooglePaper: React.FC<{ classes: any, onClick: () => void }> = (props) => {
  const { classes, onClick } = props
  return (
    <Grid item xs={12} className={classes.mypaper}>
      <Paper className={classes.accountroot} elevation={1}>
        <div onClick={onClick}>
          <Button variant="contained" color="secondary" className={classes.button}>ログアウト</Button>
        </div>
      </Paper>
    </Grid>
  )
}


function Transition(props: any) {
  return <Slide direction="up" {...props} />;
}
