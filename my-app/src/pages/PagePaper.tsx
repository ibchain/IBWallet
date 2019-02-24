import * as React from 'react'
import { connect } from 'react-redux'
import { Grid, Paper, Typography, withStyles, Button } from '@material-ui/core'
import { RouteComponentProps, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { UserState, CouponState, State } from '../common/reducer';
import { PaperTable } from '../components/PaperTable';
import { IBCoupon, claimPaperAsset } from '../common/IBCoupon';

let debug = require('debug')
let log = debug('PapgePaper');
log.log = console.log.bind(console)


interface MapStateProps {
  user: UserState
  code: string
  copuon: CouponState
}
interface MapDispatchProps {
  paperAction: claimPaperAsset
  getPaperInfo: (code: string) => void
}
type PageProps = MapStateProps & MapDispatchProps

interface PageState {
  address: string
  qty: number
  buttonText: string
  loading: boolean
  redirect: boolean
  res?: any
}

class Page extends React.Component<PageProps, PageState> {

  constructor(props: PageProps) {
    super(props)
    this.state = {
      address: `${props.user.address}`,
      qty: 0,
      buttonText: 'ペーパーアカウントからコインを取得する',
      loading: true,
      redirect: false
    }
  }

  componentDidMount() {
    log('componentDidMount()')
    this.props.getPaperInfo(this.props.code)
  }

  componentWillReceiveProps() {
  }

  render() {
    log('params:', this.props)
    // const code = this.props.code
    if (!this.state.loading && this.state.redirect) {
      return <Redirect to={{ pathname: '/pay' }} />
    }
    let add = ''
    if (!!this.props.copuon && !!this.props.copuon.address) {
      add = this.props.copuon.address.substr(0, Math.min(this.state.address.length, 10)) + '.....'
    }
    let qty = 0
    if (!!this.props.copuon && !!this.props.copuon.qty) {
      qty = this.props.copuon.qty;
    }
    let disabled = !(!!add && 0 < add.length && 0 <= qty)

    return (
      <Grid
        container
        direction='column'
        justify="space-between"
        alignItems="stretch">
        <Grid item xs={12}>
          <PaperTable address={add} qty={qty} />
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'center', margin: '20px' }}>
          <Button
            onClick={() => {
              if (!this.state.res) { this.props.paperAction(this.props.code, this.state.qty) }
              else { this.setState({ redirect: true }) }
            }}
            variant="contained" color="primary"
            disabled={disabled}
          >
            {this.state.buttonText}
          </Button><br />
          <Link to={`/share/${this.props.copuon.address}/`}>
            <Button variant="contained" disabled={disabled} style={{ marginTop: '20px' }} >
              この口座にチャージする
              </Button>
          </Link>

        </Grid>
      </Grid>
    )
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
    user: state.user,
    code: routerProps.match.params.code,
    copuon: state.coupon,
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

export const PagePaper = connect(mapState, mapDispatch)(Page)