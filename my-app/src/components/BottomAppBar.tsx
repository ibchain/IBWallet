import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Tabs, Tab } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Home from '@material-ui/icons/Home'
import PersonOutline from '@material-ui/icons/PersonOutline'
import SupervisorAccount from '@material-ui/icons/SupervisorAccount'
import { withRouter } from 'react-router-dom'

let debug = require('debug')
let log = debug('BottomAppBar');

const styles = (_theme: any): any => {
  return ({
    appBar: {
      top: 'auto',
      bottom: 0,
    },
  });
}

const pageNames = ['/pay', '/transfer', '/account' ]

interface MyProps {
  classes: any
  history: any
  location: any
}

const MyComponent: React.FC<MyProps> = (props) => {

  const { classes } = props
  const page = pageNames.indexOf(props.location.pathname)
  const handleChange = (_event: React.ChangeEvent<{}>, value: any): void => {
    props.history.push(pageNames[value])
  }
  log(`page no ={ ${page} }`)
  // if (page < 0) {
  //   return <div></div>
  // }
  return (
    <React.Fragment>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Tabs value={page} onChange={handleChange} variant="fullWidth" scrollButtons="off">
          <Tab icon={<Home />} />
          {/* <Tab icon={<Payment />} /> */}
          <Tab icon={<SupervisorAccount />} />
          <Tab icon={<PersonOutline />} />
        </Tabs>
      </AppBar>
    </React.Fragment>
  )
}


export const BottomAppBar = withRouter(withStyles(styles)(MyComponent) as any)
