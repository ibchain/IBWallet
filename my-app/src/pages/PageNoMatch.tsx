//
// NoMatch Page
// path: none
//

import * as React from 'react'
import { Grid, Typography, withStyles, Paper } from '@material-ui/core'

const styles: any = (theme: any) => ({
  nomatch: {
    textAlign: 'center',
    margin: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
})

interface PageProps {
  classes: any
}

const Page: React.FC<PageProps> = (props) => {

  const { classes } = props

  return (
    <Grid
      container
      direction='column'
      justify="space-between"
      alignItems="stretch">
      <Grid item xs={12}>
        <Paper className={classes.nomatch} >
          <Typography variant="body1" color="inherit">指定されたページは見つかりません</Typography>
        </Paper>
      </Grid>
    </Grid>
  )
}


// ---------------------------------------------
// Component
// ---------------------------------------------


// ---------------------------------------------
// Redux, Material-UI
// ---------------------------------------------

export const PageNoMatch = withStyles(styles)(Page)