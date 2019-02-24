import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
};

const ButtonAppBar: React.FC<{ classes: any }> = (props) => {

  const { classes } = props

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            IB Wallet
            </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}


export const MyAppBar = withStyles(styles)(ButtonAppBar)
