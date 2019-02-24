import * as React from 'react'
import { connect } from 'react-redux'
import { Grid, Paper, Typography, withStyles } from '@material-ui/core'
import { UserState, State } from '../common/reducer';
import { MyAccount } from '../components/AddressAssetTable';

let QRCode = require('qrcode.react')

let debug = require('debug')
let log = debug('[PAGE]{/pay}');

const styles: any = (theme: any) => ({
  qrPaper: {
    textAlign: 'center',
    margin: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  qr: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})

interface MapProps {
  user: UserState
}


interface PageProps {
  classes: any
}

class Page extends React.Component<PageProps & MapProps, {}> {

  render() {
    const { classes } = this.props
    const { address, paycode } = this.props.user
    let add = ''
    if (address) {
      add = address.substr(0, Math.min(address.length, 10)) + '.....'
    }

    const url = window.location.href.replace('/pay', '') +
      ((): string => {
        if (!!paycode) {
          return `/claim/${paycode}/`
        } else if (!!address) {
          return `/paper/${address}/`
        }
        return '/login'
      })()

    log('QR', url)
    return (
      <Grid
        container
        direction='column'
        justify="space-between"
        alignItems="stretch">
        <Grid item xs={12}>
          <MyAccount address={add} />
        </Grid>
        <Grid item xs={12}>
          <MyQr classes={classes} code={url} title="支払いコード" />
        </Grid>
      </Grid>
    )
  }

}

// ---------------------------------------------
// Component
// ---------------------------------------------

const MyQr: React.FC<{ classes: any, code: string, title: string }> = (props) => {
  const { classes } = props
  return (
    <Paper className={classes.qrPaper} >
      <Typography variant="body1" color="inherit">{props.title}</Typography>
      <QRCode value={props.code} className={classes.qr} />
    </Paper>
  );
}


// ---------------------------------------------
// Redux
// ---------------------------------------------

const mapState = (state: State): MapProps => {
  // log("mapState", state)
  return ({
    user: state.user
  })
}

export const PagePay = withStyles(styles)(connect(mapState)(Page))