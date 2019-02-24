import * as React from 'react'
import { connect } from 'react-redux'
import { Grid, Paper, withStyles, Button, TextField } from '@material-ui/core'
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom'
import { ChangeEventHandler } from "react";
import { CouponState, State } from '../common/reducer';
import { IBCoupon } from '../common/IBCoupon';

let debug = require('debug')
let log = debug('[PAGE]{/claim}');

const styles: any = (theme: any) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  addButton: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  }
})

interface MapStateProps {
  code: string
  coupon: CouponState
}
interface MapDispatchProps {
  paperAction: (code: string, qty: number) => void
  getPaperInfo: (code: string) => void
}
type PageProps = { classes: any } & MapStateProps & MapDispatchProps

interface PageState {
  qty: number
  check: boolean
}
export interface SendAsset {
  code: string
  qty: number
}

class Page extends React.Component<PageProps, PageState> {

  constructor(props: PageProps) {
    super(props)
    this.state = {
      qty: 0,
      check: false,
    }
  }

  componentDidMount() {
    log('componentDidMount()')
    this.props.getPaperInfo(this.props.code)
  }

  componentWillReceiveProps() {
    const { coupon } = this.props
    this.setState({
      check: !!coupon.address && (0 < this.state.qty),
    })
  }
  render() {
    log('render props:', this.props)

    const { classes } = this.props
    return (
      <Grid item xs={12}>
        <Grid item xs={12}>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              required
              id="outlined-required"
              label="請求先アドレス"
              // defaultValue=""
              className={classes.textField}
              margin="normal"
              variant="outlined"
              fullWidth
              value={this.props.coupon.address}
              onChange={this.handleChangeAddress}
            />
            <TextField
              id="outlined-number"
              label={'IBC'}
              value={this.state.qty}
              onChange={this.handleChangeQty}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
              fullWidth
            />
          </form>
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ textAlign: 'center', padding: '8px' }}>
            <Button
              onClick={this.handleClick}
              disabled={!this.state.check}
              variant="contained" color="secondary"
            >
              請求
              </Button>
          </Paper>
        </Grid>
      </Grid >
    )
  }

  // ------------------------
  // handlers
  // ------------------------
  private handleClickAdd = (value: number) => {
    log('handleClickAdd', value)
    this.setQty(this.state.qty + value)
  }

  private handleClickSet = (value: number) => {
    log('handleClickSet', value)
    this.setQty(value)
  }

  private setQty = (qty: number): void => {
    this.setState({
      check: (0 < qty),
      qty: Math.min(1000, Math.max(0, qty))
    })
  }

  private handleClick = () => {
    log('on click claim button')
    const { code } = this.props
    const { qty } = this.state
    if (!code || code.length === 0 || !qty || qty <= 0) return
    log('onClick params', { code, qty })
    this.props.paperAction(code, qty)
  }

  private handleChangeAddress: ChangeEventHandler = (event: { target: any }): void => {
    let { value } = event.target
    this.setState({
      check: (value && 0 < value.length) && (0 < this.state.qty),
    })
    // this.onChangeEvent()
  }

  private handleChangeQty: ChangeEventHandler = (event: { target: any }): void => {
    let { value } = event.target
    let qty = 1 * value
    if (isNaN(qty)) {
      qty = 1 * this.state.qty
    }
    this.setState({
      check: (0 < qty),
      qty: Math.min(1000, Math.max(0, qty))
    })
    // this.onChangeEvent()
  }

}

// ---------------------------------------------
// Component
// ---------------------------------------------

// ---------------------------------------------
// Redux
// ---------------------------------------------

const mapState = (state: State, routerProps: RouteComponentProps<{ code: string }>): MapStateProps => {
  log("mapState", state, routerProps)
  return ({
    // address: state.user.address,
    code: routerProps.match.params.code,
    // assetName: 'ibcoin',
    coupon: state.coupon,

  })
}
const mapDispatch = (dispatch: any): MapDispatchProps => {
  // const actionDispatcher = new ActionDispatcher(dispatch)
  const actions = new IBCoupon(dispatch);
  return {
    paperAction: actions.claimPaperAsset,
    getPaperInfo: actions.getPaperBalance,
  }
}

export const PageClaim = withRouter(connect(mapState, mapDispatch)(withStyles(styles)(Page)));