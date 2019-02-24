//
// 送金画面(transfer)
// path: /transfer
//

import * as React from 'react';
import { connect } from 'react-redux'
import { Grid, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Slide, Typography } from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router';
import { Hub } from 'aws-amplify';
import { UserState, State } from '../common/reducer';
import { SendAssetParams, SendAssetSuccess } from '../common/wallet/sendasset';
import { MyAccount } from '../components/AddressAssetTable';
import { IBWallet } from '../common/IBWallet';
import { InputAsset, SendAsset } from '../components/InputAsset';

let debug = require('debug')
let log = debug('PageTransfer');
log.log = console.log.bind(console);

interface MapStateProps {
  user: UserState
  toAddress?: string
}
interface MapDispatchProps {
  sendCoinAction: (params: SendAssetParams) => void
}

type PageProps = MapStateProps & MapDispatchProps;

interface PageState {
  disabledConfirm: boolean
  dialog: boolean
  dialogMessage: string
  send?: SendAssetParams
  address?: string
  qty?: number
  resultDialog: boolean
  resultMessage: string
}

class Page extends React.Component<PageProps, PageState> {

  constructor(props: PageProps) {
    super(props)
    log('constructor')
    this.state = {
      disabledConfirm: false,
      dialog: false,
      dialogMessage: '',
      resultDialog: false,
      resultMessage: '',
      address: props.toAddress
    }

  }
  componentDidMount() {
    Hub.listen('sendAsset', this)
  }
  onHubCapsule = (capsule: any) => {
    log('onHubCapsule', capsule)
    //{channel: "sendAsset", payload: {event: "success", data: {…}}, source: "IBWallet"}
    const { payload } = capsule
    const { event } = payload
    if (event === 'start') {
      log('送信開始')
    } else if (event === 'success') {
      this.onSuccessSendAsset(payload.data)
    } else {
      this.onFailureSendAsset(payload.errorMessage)
    }
  }

  componentWillUnmount() {
    // リスナーを削除する
    Hub.remove('sendAsset', this)
  }

  render() {
    log('render')

    const { address } = this.props.user
    let add = ''
    if (address) {
      add = address.substr(0, Math.min(address.length, 10)) + '.....'
    }

    const toAddress = this.state.address ? this.state.address : this.props.toAddress

    return (
      <Grid
        container
        direction='column'
        justify="space-between"
        alignItems="stretch">
        <Grid item xs={12}>
          <MyAccount address={add} />
        </Grid>
        <Grid item xs={12} style={{ marginTop: '10px' }}>
          <Typography variant="subtitle1" color="inherit" style={{ textAlign: 'center' }}>コインを送信</Typography>
          <InputAsset
            assetName='IBC'
            onClick={this.handleClickConfirm}
            disabledButton={this.state.disabledConfirm}
            onChange={this.handleOnChangeAsset}
            address={toAddress}
            qty={this.state.qty}
          />
        </Grid>
        <MyDialog
          dialog={this.state.dialog}
          handleClose={this.handleClose}
          dialogMessage={this.state.dialogMessage}
          handleCancel={this.handleCancel}
          handleOk={this.handleOk}
        />
        <ResultDialog
          resultDialog={this.state.resultDialog}
          handleCloseResultDialog={this.handleCloseResultDialog}
          resultMessage={this.state.resultMessage}
        />
      </Grid>
    )
  }
  handleClickConfirm = (value: SendAsset) => {
    log('handleClickConfirm', value)
    const { address, qty } = value
    let message = address + ' に ' + qty + ' [ IBC ] を送信します'
    const sendParams: SendAssetParams = {
      to: address,
      qty: qty,
      assetName: 'ibcoin',
      fromAddress: '' + this.props.user.address
    }
    this.setState({
      disabledConfirm: true,
      dialog: true,
      dialogMessage: message,
      send: sendParams,
      address: address,
      qty: qty
    })
  }
  handleOnChangeAsset = () => {
    if (this.state.disabledConfirm) {
      log('handleOnChangeAsset')
      this.setState({
        disabledConfirm: false
      })
    }
  }

  closeResultDialog = () => {
    this.setState({
      resultDialog: false
    })
  }
  handleCloseResultDialog = () => {
    this.closeResultDialog()
  }
  // -----------------

  handleClose = () => {
    this.setState({
      disabledConfirm: false,
      dialog: false
    })
  }
  handleCancel = () => {
    log("handleCancel ============= キャンセル！！")
    this.setState({
      dialog: false,
      dialogMessage: '',
      disabledConfirm: false,
    })
  }
  handleOk = () => {
    log("handleOk ============= 送信！！")
    this.setState({
      dialog: false,
      dialogMessage: '',
      disabledConfirm: false,
    })
    if (!!this.state.send) {
      this.props.sendCoinAction(this.state.send)
    }
  }
  onReceiveResult = (err: string, result: SendAssetSuccess): void => {
    if (!!result) {
      const resId = result.resId
      if (resId && (resId as any).errorMessage) {
        // 送信失敗
        this.onFailureSendAsset((resId as any).errorMessage as string)

      } else {
        this.onSuccessSendAsset(result)
      }
    } else {
      this.onFailureSendAsset(err)
    }

  }
  onSuccessSendAsset = (result: SendAssetSuccess) => {
    this.showResultDialog('送信成功')
    this.clearAsset()
  }
  onFailureSendAsset = (err: string) => {
    // 送信失敗
    this.showResultDialog(`送信失敗 [ ${err} ]`)

  }
  showResultDialog = (message: string) => {
    this.setState({
      resultDialog: true,
      resultMessage: message
    })
  }
  clearAsset = () => {
    this.setState({
      address: ' ',
      qty: 0
    })
  }

}
// ---------------------------------------------
// Component
// ---------------------------------------------

const Transition: React.FC<any> = (props) => {
  return <Slide direction="up" {...props} />;
}

interface MyDialogProps {
  dialog: boolean,
  handleClose: () => void,
  dialogMessage: string,
  handleCancel: () => void,
  handleOk: () => void
}
const MyDialog: React.FC<MyDialogProps> = (props) => {
  const { dialog, handleClose, dialogMessage, handleCancel, handleOk } = props
  return (
    <Dialog
      open={dialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{"Information"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {dialogMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="secondary" variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface ResultDialogProps {
  resultDialog: boolean,
  handleCloseResultDialog: () => void
  resultMessage: string
}
const ResultDialog: React.FC<ResultDialogProps> = (props) => {
  const { resultDialog, handleCloseResultDialog, resultMessage } = props
  return (
    <Dialog
      open={resultDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseResultDialog}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{"Information"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {resultMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseResultDialog} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ---------------------------------------------
// Redux
// ---------------------------------------------

const mapState = (state: State, routerProps: RouteComponentProps<{}>): MapStateProps => {
  log("mapState", state, routerProps)
  return ({
    user: state.user,
    toAddress: routerProps.location.state
  })
}

const mapDispatch = (dispatch: any): MapDispatchProps => {
  return {
    sendCoinAction: new IBWallet(dispatch).sendAsset
  }
}

export const PageTransfer = withRouter(connect(mapState, mapDispatch)(Page))